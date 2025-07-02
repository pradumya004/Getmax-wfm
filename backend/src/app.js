// backend/src/app.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();

const app = express();

console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);

// CORS Configuration
app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000"
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Origin', 'Accept'],
}));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Body parsing middleware
app.use(express.json({
    limit: "16kb",
    type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Static files middleware
app.use(express.static("public"));

// Cookie parser middleware
app.use(cookieParser());

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`📝 ${req.method} ${req.path} - ${req.ip} - ${new Date().toISOString()}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'GetMax WFM Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

// Routes
import allRoutes from './routes/index.route.js';
app.use('/api', allRoutes);

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

app.use(notFoundHandler);   // 404 Not Found handler
app.use(errorHandler);       // Global error handler

export { app };