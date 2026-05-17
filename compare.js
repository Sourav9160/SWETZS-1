import { Router } from 'express';
import User from '../models/User.js';
import Pokemon from '../models/Pokemon.js';
import { authenticate } from '../middleware/auth.js';
import { getTypeTheme, MAX_STAT } from '../utils/pokemonHelpers.js';

const router = Router();
const MAX_COMPARE = 4;

router.use(authenticate);

function enrich(p) {
  const doc = p.toObject ? p.toObject() : p;
  return { ...doc, theme: getTypeTheme(doc.types?.[0]), maxStat: MAX_STAT };
}

router.get('/', async (req, res) => {
  const user = await User.findById(req.user._id);
  const pokemon = await Pokemon.find({ dexNumber: { $in: user.compareList } }).sort({
    dexNumber: 1,
  });
  res.json({
    data: pokemon.map(enrich),
    total: user.compareList.length,
    max: MAX_COMPARE,
  });
});

router.post('/:dexNumber', async (req, res) => {
  const dexNumber = parseInt(req.params.dexNumber, 10);
  const exists = await Pokemon.findOne({ dexNumber });
  if (!exists) return res.status(404).json({ error: 'Pokémon not found' });

  const user = await User.findById(req.user._id);
  if (user.compareList.includes(dexNumber)) {
    return res.json({ compareList: user.compareList });
  }
  if (user.compareList.length >= MAX_COMPARE) {
    return res.status(400).json({ error: `Maximum ${MAX_COMPARE} Pokémon in compare list` });
  }
  user.compareList.push(dexNumber);
  await user.save();
  res.json({ compareList: user.compareList });
});

router.delete('/:dexNumber', async (req, res) => {
  const dexNumber = parseInt(req.params.dexNumber, 10);
  const user = await User.findById(req.user._id);
  user.compareList = user.compareList.filter((id) => id !== dexNumber);
  await user.save();
  res.json({ compareList: user.compareList });
});

router.delete('/', async (req, res) => {
  const user = await User.findById(req.user._id);
  user.compareList = [];
  await user.save();
  res.json({ compareList: [] });
});

export default router;
