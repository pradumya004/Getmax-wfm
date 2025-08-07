// backend/server.js

import dotenv from 'dotenv';
import fs from 'fs';
import { app } from './src/app.js';
import connectDB from './src/config/connection.config.js';
import { testEmailConnection } from './src/config/email.config.js';
import { validateCloudinaryConnection } from './src/config/cloudinary.config.js';
import { initializeRedis } from './src/config/redis.config.js';
import {
  MULTER_AVATAR_PATH,
  MULTER_DOCUMENT_PATH,
  MULTER_BULK_PATH,
  MULTER_TEMP_PATH
} from './src/constants.js';

dotenv.config();

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    MULTER_AVATAR_PATH,
    MULTER_DOCUMENT_PATH,
    MULTER_BULK_PATH,
    MULTER_TEMP_PATH,
    './public',
    './public/uploads',
    './public/uploads/temp'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log(`📁 Creating upload directories...`);
    createUploadDirs();

    console.log(`🔃 Connecting to MongoDB...`);
    await connectDB();
    console.log(`🟢 MongoDB Connected Successfully!`);

    // Test Email Service
    console.log(`📧 Testing email service...`);
    const emailTest = await testEmailConnection();
    if (emailTest.success) {
      console.log('🟢 Email service configured and working');
    } else {
      console.warn('🟡 Email service issue:', emailTest.message || 'Unknown error');
    }

    // Test Cloudinary
    console.log(`☁️ Testing Cloudinary service...`);
    const cloudinaryTest = await validateCloudinaryConnection();
    if (cloudinaryTest) {
      console.log('🟢 Cloudinary service configured and working');
    } else {
      console.warn('🟡 Cloudinary service issue - file uploads may not work');
    }

    // Test Redis (Optional)
    // console.log(`🔴 Testing Redis service...`);
    // const redisTest = await initializeRedis();
    // if (redisTest.success) {
    //   console.log('🟢 Redis service configured and working');
    // } else {
    //   console.warn('🟡 Redis service issue:', redisTest.message || 'Running without cache');
    // }

    app.listen(port, () => {
      console.log(`🚀 GetMax WFM Backend Server`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Port: ${port}`);
      console.log(`🚀 Base URL: ${process.env.BASE_URL || `http://localhost:${port}`}`);
      console.log(`🚀 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🚀 MongoDB: Connected`);
      console.log(`🚀 Email Service: ${emailTest.success ? 'Ready' : 'Limited'}`);
      console.log(`🚀 Cloudinary: ${cloudinaryTest ? 'Ready' : 'Limited'}`);
      // console.log(`🚀 Redis: ${redisTest.success ? 'Ready' : 'Disabled'}`);
    });

    app.on('error', (error) => {
      console.error(`❌ Server Error: ${error}`);
      throw error;
    })

  } catch (error) {
    console.error(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();

// import { closeRedis } from './src/config/redis.config.js';

// // Graceful shutdown
// process.on('SIGTERM', async () => {
//   console.log('🔴 SIGTERM received, shutting down gracefully...');
//   await closeRedis();
//   process.exit(0);
// });

// process.on('SIGINT', async () => {
//   console.log('🔴 SIGINT received, shutting down gracefully...');
//   await closeRedis();
//   process.exit(0);
// });