import 'dotenv/config';
import mongoose from 'mongoose';
import Pokemon from '../models/Pokemon.js';
import { classifyPokemon } from '../utils/pokemonHelpers.js';

const POKEAPI = 'https://pokeapi.co/api/v2';
const GEN4_MAX = 493;
const DELAY_MS = 100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url}`);
  return res.json();
}

async function fetchPokemon(id) {
  const data = await fetchJson(`${POKEAPI}/pokemon/${id}`);
  const species = await fetchJson(data.species.url);
  const flavor = species.flavor_text_entries.find((e) => e.language.name === 'en');
  const description = flavor?.flavor_text?.replace(/\f|\n/g, ' ') || '';

  const stats = {};
  for (const s of data.stats) {
    const key =
      s.stat.name === 'special-attack'
        ? 'specialAttack'
        : s.stat.name === 'special-defense'
          ? 'specialDefense'
          : s.stat.name;
    stats[key] = s.base_stat;
  }

  const classification = classifyPokemon(id);
  const evolvesFrom = null;
  const evolvesTo = [];

  return {
    dexNumber: id,
    name: data.name,
    slug: data.name,
    types: data.types.map((t) => t.type.name),
    ...classification,
    stats,
    sprite: data.sprites.front_default,
    artwork: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
    height: data.height,
    weight: data.weight,
    description,
    evolutionChainId: null,
    evolvesFrom,
    evolvesTo,
    abilities: data.abilities.map((a) => a.ability.name),
  };
}

async function loadEvolutionChains() {
  const chainMap = new Map();
  for (let id = 1; id <= GEN4_MAX; id++) {
    try {
      const species = await fetchJson(`${POKEAPI}/pokemon-species/${id}`);
      const chainId = parseInt(species.evolution_chain.url.split('/').filter(Boolean).pop(), 10);
      if (!chainMap.has(chainId)) {
        const chainData = await fetchJson(species.evolution_chain.url);
        const members = [];
        function walk(node) {
          const num = parseInt(node.species.url.split('/').filter(Boolean).pop(), 10);
          if (num <= GEN4_MAX) members.push(num);
          node.evolves_to?.forEach(walk);
        }
        walk(chainData.chain);
        chainMap.set(chainId, members.sort((a, b) => a - b));
      }
      await sleep(DELAY_MS);
    } catch (e) {
      console.warn(`Evolution chain skip ${id}:`, e.message);
    }
    if (id % 50 === 0) console.log(`Evolution progress: ${id}/${GEN4_MAX}`);
  }
  return chainMap;
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swetzs';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const count = await Pokemon.countDocuments();
  if (count >= GEN4_MAX) {
    console.log(`Database already has ${count} Pokémon. Skipping seed.`);
    process.exit(0);
  }

  console.log('Loading evolution chains...');
  const chainMap = await loadEvolutionChains();

  console.log('Seeding Pokémon Gen 1–4...');
  await Pokemon.deleteMany({});

  for (let id = 1; id <= GEN4_MAX; id++) {
    try {
      const pokemon = await fetchPokemon(id);
      for (const [chainId, members] of chainMap) {
        if (members.includes(id)) {
          pokemon.evolutionChainId = chainId;
          const idx = members.indexOf(id);
          if (idx > 0) pokemon.evolvesFrom = members[idx - 1];
          pokemon.evolvesTo = members.slice(idx + 1);
          break;
        }
      }
      await Pokemon.create(pokemon);
      console.log(`✓ #${String(id).padStart(3, '0')} ${pokemon.name}`);
    } catch (e) {
      console.error(`✗ #${id}:`, e.message);
    }
    await sleep(DELAY_MS);
  }

  const total = await Pokemon.countDocuments();
  console.log(`\nSeed complete: ${total} Pokémon in database`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
