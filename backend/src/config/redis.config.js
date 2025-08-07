// backend/src/config/redis.config.js

import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis Configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB) || 0,
    connectTimeout: 10000,
    lazyConnect: true,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    family: 4, // IPv4
    keepAlive: 30000,
};

// Create Redis instance
let redisClient = null;

// Initialize Redis connection
export const initializeRedis = async () => {
    try {
        if (!redisClient) {
            redisClient = new Redis(redisConfig);

            redisClient.on('connect', () => {
                console.log('🔴 Redis connecting...');
            });

            redisClient.on('ready', () => {
                console.log('🟢 Redis connected successfully');
            });

            redisClient.on('error', (err) => {
                console.warn('🟡 Redis connection error:', err.message);
                // Don't exit process on Redis errors - continue without cache
            });

            redisClient.on('close', () => {
                console.log('🔴 Redis connection closed');
            });

            redisClient.on('reconnecting', () => {
                console.log('🟡 Redis reconnecting...');
            });

            // Test connection
            await redisClient.ping();
            console.log('🟢 Redis ping successful');
        }

        return redisClient;
    } catch (error) {
        console.warn('🟡 Redis initialization failed:', error.message);
        console.warn('🟡 Continuing without Redis cache...');
        redisClient = null;
        return null;
    }
};

// Get Redis client instance
export const getRedisClient = () => {
    return redisClient;
};

// Cache operations with fallback
export const cacheSet = async (key, value, ttl = 3600) => {
    try {
        if (!redisClient) return false;

        const serializedValue = JSON.stringify(value);
        if (ttl) {
            await redisClient.setex(key, ttl, serializedValue);
        } else {
            await redisClient.set(key, serializedValue);
        }
        return true;
    } catch (error) {
        console.warn('Cache set error:', error.message);
        return false;
    }
};

export const cacheGet = async (key) => {
    try {
        if (!redisClient) return null;

        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.warn('Cache get error:', error.message);
        return null;
    }
};

export const cacheDel = async (...keys) => {
    try {
        if (!redisClient) return false;

        await redisClient.del(...keys);
        return true;
    } catch (error) {
        console.warn('Cache delete error:', error.message);
        return false;
    }
};

export const cacheFlush = async () => {
    try {
        if (!redisClient) return false;

        await redisClient.flushdb();
        return true;
    } catch (error) {
        console.warn('Cache flush error:', error.message);
        return false;
    }
};

// Session operations
export const setSession = async (sessionId, sessionData, ttl = 86400) => {
    return cacheSet(`session:${sessionId}`, sessionData, ttl);
};

export const getSession = async (sessionId) => {
    return cacheGet(`session:${sessionId}`);
};

export const deleteSession = async (sessionId) => {
    return cacheDel(`session:${sessionId}`);
};

// Rate limiting operations
export const incrementRateLimit = async (key, window = 900) => {
    try {
        if (!redisClient) return { count: 1, ttl: window };

        const pipeline = redisClient.pipeline();
        pipeline.incr(key);
        pipeline.expire(key, window);

        const results = await pipeline.exec();
        const count = results[0][1];
        const ttl = await redisClient.ttl(key);

        return { count, ttl };
    } catch (error) {
        console.warn('Rate limit error:', error.message);
        return { count: 1, ttl: window };
    }
};

// Close Redis connection
export const closeRedis = async () => {
    try {
        if (redisClient) {
            await redisClient.quit();
            redisClient = null;
            console.log('🔴 Redis connection closed gracefully');
        }
    } catch (error) {
        console.warn('Error closing Redis connection:', error.message);
    }
};

// Health check
export const redisHealthCheck = async () => {
    try {
        if (!redisClient) return { status: 'disconnected', message: 'Redis not initialized' };

        const start = Date.now();
        await redisClient.ping();
        const latency = Date.now() - start;

        const info = await redisClient.info('memory');

        return {
            status: 'connected',
            latency: `${latency}ms`,
            memory: info.split('\r\n').find(line => line.startsWith('used_memory_human:'))?.split(':')[1] || 'unknown'
        };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
};

export default redisClient;