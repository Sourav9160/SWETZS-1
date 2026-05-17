import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username min 3 chars'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: 'Username or email already exists' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ user, token });
  }
);

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
