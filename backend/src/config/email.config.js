// backend/src/config/email.config.js

import nodemailer from 'nodemailer';

// Email transporter configuration
const createEmailTransporter = () => {
    if (!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS)) {
        console.warn(`⚠️ Warning: Email configuration incomplete! Email features will be disabled!`);
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number.isInteger(Number(process.env.EMAIL_PORT)) ? Number(process.env.EMAIL_PORT) : 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // For development
        }
    });
};

// Initialize transporter
export const emailTransporter = createEmailTransporter();

// Test email connection
export const testEmailConnection = async () => {
    if (!emailTransporter) {
        return { success: false, message: 'Email transporter not configured.' };
    }

    try {
        await emailTransporter.verify();
        return { success: true, message: 'Email transporter is ready.' };
    } catch (error) {
        console.error('Error verifying email transporter:', error);
        return { success: false, message: `Email transporter verification failed: ${error.message}` };
    }
}