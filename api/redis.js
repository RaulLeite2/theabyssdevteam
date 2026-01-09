import Redis from 'ioredis';

let redis = null;

export function getRedis() {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      connectTimeout: 10000,
    });
    
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  
  return redis;
}

// Helper functions para manter compatibilidade
export async function kvGet(key) {
  const redis = getRedis();
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function kvSet(key, value, options = {}) {
  const redis = getRedis();
  const serialized = JSON.stringify(value);
  
  if (options.ex) {
    await redis.setex(key, options.ex, serialized);
  } else {
    await redis.set(key, serialized);
  }
}

export async function kvDel(key) {
  const redis = getRedis();
  await redis.del(key);
}

export async function kvKeys(pattern) {
  const redis = getRedis();
  return await redis.keys(pattern);
}
