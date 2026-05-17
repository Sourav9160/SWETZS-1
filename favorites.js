import { Router } from 'express';
import User from '../models/User.js';
import Pokemon from '../models/Pokemon.js';
import { authenticate } from '../middleware/auth.js';
import { getTypeTheme, MAX_STAT } from '../utils/pokemonHelpers.js';

const router = Router();

function enrich(p) {
  const doc = p.toObject();
  return { ...doc, theme: getTypeTheme(doc.types?.[0]), isFavorite: true, maxStat: MAX_STAT };
}
router.use(authenticate);

router.get('/', async (req, res) => {
  const user = await User.findById(req.user._id);
  const pokemon = await Pokemon.find({ dexNumber: { $in: user.favorites } }).sort({
    dexNumber: 1,
  });
  res.json({
    data: pokemon.map(enrich),
    total: user.favorites.length,
  });
});

router.post('/:dexNumber', async (req, res) => {
  const dexNumber = parseInt(req.params.dexNumber, 10);
  const exists = await Pokemon.findOne({ dexNumber });
  if (!exists) return res.status(404).json({ error: 'Pokémon not found' });

  const user = await User.findById(req.user._id);
  if (!user.favorites.includes(dexNumber)) {
    user.favorites.push(dexNumber);
    await user.save();
  }
  res.json({ favorites: user.favorites });
});

router.delete('/:dexNumber', async (req, res) => {
  const dexNumber = parseInt(req.params.dexNumber, 10);
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter((id) => id !== dexNumber);
  await user.save();
  res.json({ favorites: user.favorites });
});

export default router;
