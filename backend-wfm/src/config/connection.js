// backend/src/config/database.js

import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://arorapiyush991:get_max_sol@wfmcluster.zk4btez.mongodb.net/?retryWrites=true&w=majority&appName=WfmCluster");

        console.log(`🍃 MongoDB Connected: ${connectionInstance.connection.host}`);

        // Connection Event Listeners
        mongoose.connection.on('disconnected', () => {
            console.log('❌ MongoDB disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.log(`❌ MongoDB connection error: ${err}`);
        });
    } catch (err) {
        console.error(`❌ Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;