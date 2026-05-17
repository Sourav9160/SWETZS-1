import { createClient } from 'redis';

let client = null;

export async function connectRedis() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  client = createClient({ url });
  client.on('error', (err) => console.warn('Redis error:', err.message));
  try {
    await client.connect();
    console.log('Redis connected');
  } catch {
    console.warn('Redis unavailable — caching disabled');
    client = null;
  }
}

export function getRedis() {
  return client?.isOpen ? client : null;
}

export async function cacheGet(key) {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 300) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export async function cacheDel(pattern) {
  const redis = getRedis();
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(keys);
  } catch {
    /* ignore */
  }
}
