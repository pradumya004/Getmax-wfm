// backend-wfm/server.js

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/connection.js';
import { app } from './src/app.js';

const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    console.log(`MongoDB Connected Successfully!`);

    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });

    app.on('error', (error) => {
      console.error(`Server Error: ${error}`);
      throw error;
    })

  } catch (error) {
    console.error(`❌ Failed to start server: ${err}`);
    process.exit(1);
  }
};

startServer();