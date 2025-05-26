import { createClient } from 'redis';

// Đảm bảo biến môi trường được đọc đúng
const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || '6379';

export const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  }
};