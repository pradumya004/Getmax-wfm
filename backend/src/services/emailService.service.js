// backend/src/services/emailService.service.js

import { emailTransporter } from '../config/email.config.js';
import { ApiError } from '../utils/ApiError';

// Email templates
const templates = {
    // Company Welcome (from GetMax WFM)
    'company_welcome': (data) => ({
        subject: `🎉 Welcome to GetMax WFM - ${data.companyName} Setup Complete!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #34a853;">Welcome to ${data.companyName}'s WFM Portal!</h2>
                <p>Hi ${data.adminName},</p>
                <p>We're thrilled to have you onboard. Here's your company access information:</p>
                <ul>
                    <li><strong>Company:</strong> ${data.companyName}</li>
                    <li><strong>Admin Email:</strong> ${data.companyEmail}</li>
                    <li><strong>First Employee ID:</strong> ${data.firstEmployeeId}</li>
                    <li><strong>First Employee Password:</strong> ${data.firstEmployeePassword}</li>
                    <li><strong>Company Portal:</strong> <a href="${data.companyLoginUrl}">Company Login</a></li>
                    <li><strong>Employee Portal:</strong> <a href="${data.employeeLoginUrl}">Employee Login</a></li>
                </ul>
                <p>Please keep this information secure and change your password after first login.</p>
                <p>Welcome aboard! 🚀</p>
                <p>Best,<br>The GetMax WFM Team</p>
            </div>
        `
    }),

    // Employee Welcome
    'employee_welcome': (data) => ({
        subject: `🎉 Welcome to ${data.companyName} - Your WFM Account is Ready!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #34a853;">Welcome to ${data.companyName}, ${data.name}!</h2>
                <p>Your employee account has been created successfully.</p>
                <h3>Your Login Details:</h3>
                <ul>
                    <li><strong>Employee ID:</strong> ${data.employeeId}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Password:</strong> ${data.permanentPassword}</li>
                    <li><strong>Department:</strong> ${data.departmentName}</li>
                    <li><strong>Role:</strong> ${data.roleName}</li>
                    <li><strong>Designation:</strong> ${data.designationName}</li>
                </ul>
                <p><a href="${data.portalUrl}" style="background-color: #34a853; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Portal</a></p>
                <p>Please change your password after first login.</p>
                <p>Best regards,<br>${data.companyName} Team</p>
            </div>
        `
    }),

    // Password Reset
    'password_reset': (data) => ({
        subject: `🔐 Password Reset - ${data.companyName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #34a853;">Password Reset Notification</h2>
                <p>Hi ${data.name},</p>
                <p>Your password has been reset by an administrator.</p>
                <h3>New Login Details:</h3>
                <ul>
                    <li><strong>Employee ID:</strong> ${data.employeeId}</li>
                    <li><strong>New Password:</strong> ${data.newPassword}</li>
                </ul>
                <p><a href="${data.portalUrl}" style="background-color: #34a853; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Portal</a></p>
                <p>Please change your password after login for security.</p>
                <p>Best regards,<br>${data.companyName} Team</p>
            </div>
        `
    }),

    // Bulk Upload Results
    'bulk_upload_results': (data) => ({
        subject: `📊 Bulk Employee Upload Results`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #34a853;">Bulk Upload Complete</h2>
                <p>Your bulk employee upload has been processed.</p>
                <h3>Results Summary:</h3>
                <ul>
                    <li><strong>Successful:</strong> ${data.successful}</li>
                    <li><strong>Failed:</strong> ${data.failed}</li>
                    <li><strong>Duplicates:</strong> ${data.duplicates}</li>
                </ul>
                <p>Please check your admin dashboard for detailed results.</p>
                <p>Best regards,<br>GetMax WFM Team</p>
            </div>
        `
    })
};

// Send one email
export const sendEmail = async ({ to, currentTemplate, data }) => {
    try {
        if (!emailTransporter) {
            console.warn('Email transporter not configured. Skipping email send.');
            return { success: false, message: 'Email service not configured' };
        }

        console.log(`📬 Preparing to send emai to: ${to}`);
        await emailTransporter.verify();

        let emailContent;
        let subject = 'Notification from GetMax WFM';

        if (currentTemplate && templates[currentTemplate]) {
            emailContent = templates[currentTemplate](data);
            subject = emailContent.subject;
        }

        const mailOptions = {
            from: `"${data.companyName || 'GetMax'} WFM" <${process.env.EMAIL_USER}>`,
            to,
            subject: subject,
            html: emailContent?.html || data?.html || `<p>${data?.message || 'No Content'}</p>`
        };

        const result = await emailTransporter.sendMail(mailOptions);
        console.log(`📬 Email sent successfully: ${result.messageId}`);
        console.log(`📬 Email sent to : ${to}`);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(`❌ Error sending email: `, error);
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
        if (!emailTransporter) {
            return { success: false, message: 'Email transporter not configured' };
        }

        await emailTransporter.verify();
        console.log(`Email server connection verified!`);
        return { success: true, message: 'Email service is ready' };

    } catch (error) {
        console.error(`Email server connection failed: `, error);
        return { success: false, error: error.message };
    }
};