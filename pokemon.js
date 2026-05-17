import { Router } from 'express';
import Pokemon from '../models/Pokemon.js';
import { cacheGet, cacheSet } from '../config/redis.js';
import { optionalAuth } from '../middleware/auth.js';
import { getTypeTheme, MAX_STAT } from '../utils/pokemonHelpers.js';

const router = Router();

function enrichPokemon(pokemon, userFavorites = []) {
  const doc = pokemon.toObject ? pokemon.toObject() : pokemon;
  const primaryType = doc.types?.[0] || 'normal';
  return {
    ...doc,
    theme: getTypeTheme(primaryType),
    isFavorite: userFavorites.includes(doc.dexNumber),
    maxStat: MAX_STAT,
  };
}

router.get('/', optionalAuth, async (req, res) => {
  const {
    q,
    type,
    generation,
    region,
    page = 1,
    limit = 24,
    sort = 'dexNumber',
    class: pokemonClass,
    legendary,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const cacheKey = `pokemon:list:${JSON.stringify(req.query)}:${req.user?._id || 'anon'}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  const filter = {};
  if (q) {
    const num = parseInt(q, 10);
    if (!isNaN(num)) {
      filter.$or = [{ dexNumber: num }, { name: new RegExp(q, 'i') }];
    } else {
      filter.$or = [{ name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') }];
    }
  }
  if (type && type !== 'all') filter.types = type.toLowerCase();
  if (generation) filter.generation = parseInt(generation, 10);
  if (region && region !== 'all') filter.region = region.toLowerCase();
  if (pokemonClass) filter.pokemonClass = pokemonClass.toUpperCase();
  if (legendary === 'true') filter.isLegendary = true;

  const sortField = sort === 'name' ? { name: 1 } : { dexNumber: 1 };
  const [items, total] = await Promise.all([
    Pokemon.find(filter).sort(sortField).skip(skip).limit(limitNum),
    Pokemon.countDocuments(filter),
  ]);

  const favorites = req.user?.favorites || [];
  const result = {
    data: items.map((p) => enrichPokemon(p, favorites)),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasMore: skip + items.length < total,
    },
  };

  await cacheSet(cacheKey, result, 120);
  res.json(result);
});

router.get('/meta/filters', async (_req, res) => {
  const cached = await cacheGet('pokemon:meta:filters');
  if (cached) return res.json(cached);

  const [types, regions] = await Promise.all([
    Pokemon.distinct('types'),
    Pokemon.distinct('region'),
  ]);

  const meta = {
    types: types.sort(),
    regions: regions.sort(),
    generations: [1, 2, 3, 4],
    classes: ['STANDARD', 'ELITE', 'SPECTRAL', 'LEGENDARY', 'MYTHICAL'],
  };
  await cacheSet('pokemon:meta:filters', meta, 600);
  res.json(meta);
});

router.get('/:id', optionalAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid Pokémon ID' });

  const cacheKey = `pokemon:detail:${id}`;
  let pokemon = await cacheGet(cacheKey);
  if (!pokemon) {
    const doc = await Pokemon.findOne({ dexNumber: id });
    if (!doc) return res.status(404).json({ error: 'Pokémon not found' });
    pokemon = doc.toObject();
    await cacheSet(cacheKey, pokemon, 300);
  }

  const favorites = req.user?.favorites || [];
  let evolutionChain = [];
  if (pokemon.evolutionChainId) {
    evolutionChain = await Pokemon.find({ evolutionChainId: pokemon.evolutionChainId }).sort({
      dexNumber: 1,
    });
  }

  res.json({
    pokemon: enrichPokemon(pokemon, favorites),
    evolutionChain: evolutionChain.map((p) => enrichPokemon(p, favorites)),
  });
});

router.get('/:id/evolution', optionalAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pokemon = await Pokemon.findOne({ dexNumber: id });
  if (!pokemon) return res.status(404).json({ error: 'Pokémon not found' });

  const chain = pokemon.evolutionChainId
    ? await Pokemon.find({ evolutionChainId: pokemon.evolutionChainId }).sort({ dexNumber: 1 })
    : [pokemon];

  const favorites = req.user?.favorites || [];
  res.json({ evolutionChain: chain.map((p) => enrichPokemon(p, favorites)) });
});

export default router;
