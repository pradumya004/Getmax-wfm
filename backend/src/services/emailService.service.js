// backend/src/services/emailService.service.js

import nodemailer from 'nodemailer';
import { ApiError } from '../utils/ApiError';

// Create Transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: parseInt(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
};

const templates = {
    'welcome': (data) => ({
        subject: `Welcome to ${data.companyName} - Your Account Details`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #34a853;">Welcome to ${data.companyName}'s WFM Portal!</h2>
                <p>Hi ${data.name},</p>
                <p>We're thrilled to have you onboard. Here's your access information:</p>
                <ul>
                    <li><strong>Employee ID:</strong> ${data.employeeId}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Temporary Password:</strong> ${data.tempPassword}</li>
                    <li><strong>Login Portal:</strong> <a href="${data.portalUrl}">${data.portalUrl}</a></li>
                </ul>
                <p>You are expected to change your password after first login.</p>
                <p>Welcome aboard! 🚀</p>
                <p>Best,<br>The ${data.companyName} WFM Team</p>
            </div>
        `
    })
};

// Send one email
export const sendEmail = async ({ to, currentTemplate, data }) => {
    try {
        const transporter = createTransporter();

        console.log(`📬 Sending email via: `, transporter.options);
        await transporter.verify();

        let emailContent;

        if (currentTemplate && templates[currentTemplate]) {
            emailContent = templates[currentTemplate](data);
            subject = emailContent.subject;
        }

        const mailOptions = {
            from: `"${data.companyName} WFM" <${process.env.EMAIL_USER}>`,
            to,
            subject: subject,
            html: emailContent?.html || data?.html || `<p>${data?.message || 'No Content'}</p>`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`📬 Email sent successfully: `, result.messageId);
        console.log(`📬 Email sent to : `, to);
        return result;
    } catch (error) {
        console.error(`Error sending email: `, error);
        throw new ApiError(500, 'Failed to send email!');
    }
};

// Send bulk emails
export const sendBulkEmails = async (emails) => {
    const results = [];

    for (const email of emails) {
        try {
            const result = await sendEmail(email);
            results.push({ success: true, email: email.to, result });
        } catch (error) {
            results.push({ success: false, email: email.to, error: error.message });
        }
    }
    return results;
};

// Test Email Connection
export const testEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log(`Email server connection verified!`);
        
    } catch (error) {
        console.error(`Email server connection failed: `, error);
        return false;
    }
};