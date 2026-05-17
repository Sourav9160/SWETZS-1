import 'dotenv/config';
import mongoose from 'mongoose';
import Pokemon from '../models/Pokemon.js';
import { classifyPokemon } from '../utils/pokemonHelpers.js';

const POKEAPI = 'https://pokeapi.co/api/v2';
const QUICK_COUNT = 25;

async function seedQuick() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swetzs';
  await mongoose.connect(uri);
  console.log('Quick seed: first', QUICK_COUNT, 'Pokémon...');

  await Pokemon.deleteMany({});

  for (let id = 1; id <= QUICK_COUNT; id++) {
    const res = await fetch(`${POKEAPI}/pokemon/${id}`);
    const data = await res.json();
    const species = await fetch(data.species.url).then((r) => r.json());
    const flavor = species.flavor_text_entries.find((e) => e.language.name === 'en');
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
    await Pokemon.create({
      dexNumber: id,
      name: data.name,
      slug: data.name,
      types: data.types.map((t) => t.type.name),
      ...classification,
      stats,
      sprite: data.sprites.front_default,
      artwork: data.sprites.other?.['official-artwork']?.front_default,
      height: data.height,
      weight: data.weight,
      description: flavor?.flavor_text?.replace(/\f|\n/g, ' ') || '',
      abilities: data.abilities.map((a) => a.ability.name),
    });
    console.log(`✓ #${id} ${data.name}`);
  }

  console.log('Quick seed done.');
  await mongoose.disconnect();
}

seedQuick().catch((e) => {
  console.error(e);
  process.exit(1);
});
