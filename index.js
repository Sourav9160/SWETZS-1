import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.js';
import pokemonRoutes from './routes/pokemon.js';
import favoritesRoutes from './routes/favorites.js';
import compareRoutes from './routes/compare.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'online', service: 'SWETZS Neural API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/compare', compareRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await connectDB();
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`SWETZS API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
