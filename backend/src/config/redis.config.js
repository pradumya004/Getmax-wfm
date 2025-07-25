// backend/src/config/redis.config.js

import Redis from 'ioredis';
import { ApiError } from '../utils/ApiError.js';

let redisClient;
export const connectRedis = async () => {
    try {
        // Avoid duplicate connections
        if (redisClient) {
            return redisClient;
        }

        let options = {};

        if (process.env.REDIS_URL) {
            options = process.env.REDIS_URL;
        } else {
            options = {
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
            };
        }

        redisClient = new Redis(options);

        // Connection event listeners
        redisClient.on('connect', () => {
            console.log('🔌 Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis client error:', err);
        });

        // Test connection by pinging
        const result = await redisClient.ping();
        if (result !== 'PONG') {
            throw new Error('Unexpected PING response');
        }

        console.log('🟢 Redis connection verified');
        return redisClient;
    } catch (error) {
        console.error(`🔴 Failed to connect to Redis: ${error.message}`);
        throw new ApiError(500, 'Redis connection failed');
    }
};

export const getRedisClient = () => {
    if (!redisClient) {
        throw new ApiError(500, 'Redis client not initialized – call connectRedis() first');
    }
    return redisClient;
};

export default { connectRedis, getRedisClient };
