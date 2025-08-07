// backend/src/services/notificationService.service.js

import { ApiError } from '../utils/ApiError.js';
import { Notification } from '../models/system/notifications.model.js';
import { Employee } from '../models/core/employee.model.js';
// import { Company } from '../models/core/company.model.js';
// import { Role } from '../models/organization/role.model.js';
// import { Department } from '../models/organization/department.model.js';
import { sendEmail, sendBulkEmails } from './emailService.js';

// Notification Types
export const NOTIFICATION_TYPES = {
    TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    PERFORMANCE_ALERT: 'performance_alert',
    SLA_BREACH: 'sla_breach',
    SYSTEM_UPDATE: 'system_update',
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    BULK_UPLOAD_RESULT: 'bulk_upload_result',
    CLIENT_ONBOARDING: 'client_onboarding',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    LEADERBOARD_UPDATE: 'leaderboard_update',
    POLICY_UPDATE: 'policy_update',
    MAINTENANCE: 'maintenance'
};

// Create Notification
export const createNotification = async (notificationData) => {
    try {
        const {
            companyRef,
            recipients,
            title,
            message,
            type = 'info',
            priority = 'Medium',
            category = 'System',
            actionRequired = false,
            actionUrl,
            actionText,
            sendEmail = false,
            sendImmediately = true,
            scheduledFor,
            expiresAt,
            templateData = {},
            metadata = {}
        } = notificationData;

        // Validate required fields
        if (!companyRef || !recipients || !title || !message) {
            throw new ApiError(400, 'Missing required notification fields');
        }

        // Process recipients
        const processedRecipients = await processRecipients(recipients, companyRef);

        // Create notification
        const notification = await Notification.create({
            companyRef,
            recipients: processedRecipients,
            content: {
                title,
                message,
                type,
                category,
                templateData
            },
            delivery: {
                channels: sendEmail ? ['in-app', 'email'] : ['in-app'],
                priority,
                sendImmediately,
                scheduledFor: scheduledFor || new Date(),
                expiresAt
            },
            interaction: {
                actionRequired,
                actionUrl,
                actionText
            },
            systemInfo: {
                isSystemGenerated: true,
                metadata
            },
            auditInfo: {
                createdBy: notificationData.createdBy || companyRef
            }
        });

        // Send immediately if required
        if (sendImmediately) {
            await sendNotification(notification._id);
        }

        return notification;

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to create notification: ${error.message}`);
    }
};

// Process Recipients
const processRecipients = async (recipients, companyRef) => {
    const processedRecipients = [];

    for (const recipient of recipients) {
        if (typeof recipient === 'string') {
            // Handle recipient types like 'all', 'managers', 'department:id'
            const expandedRecipients = await expandRecipientType(recipient, companyRef);
            processedRecipients.push(...expandedRecipients);
        } else if (recipient.type && recipient.id) {
            // Handle object format
            processedRecipients.push({
                recipientType: recipient.type,
                recipientRef: recipient.id,
                preferredChannels: recipient.channels || ['in-app']
            });
        }
    }

    return processedRecipients;
};

// Expand Recipient Types
const expandRecipientType = async (recipientType, companyRef) => {
    const recipients = [];

    switch (recipientType) {
        case 'all':
            const allEmployees = await Employee.find({
                companyRef,
                'status.employeeStatus': 'Active'
            }).select('_id');

            recipients.push(...allEmployees.map(emp => ({
                recipientType: 'Employee',
                recipientRef: emp._id,
                preferredChannels: ['in-app', 'email']
            })));
            break;

        case 'managers':
            const managers = await Employee.find({
                companyRef,
                'status.employeeStatus': 'Active'
            })
                .populate('roleRef', 'roleLevel')
                .select('_id roleRef');

            const managerEmployees = managers.filter(emp => emp.roleRef.roleLevel >= 6);
            recipients.push(...managerEmployees.map(emp => ({
                recipientType: 'Employee',
                recipientRef: emp._id,
                preferredChannels: ['in-app', 'email']
            })));
            break;

        case 'admins':
            const admins = await Employee.find({
                companyRef,
                'status.employeeStatus': 'Active'
            })
                .populate('roleRef', 'roleLevel')
                .select('_id roleRef');

            const adminEmployees = admins.filter(emp => emp.roleRef.roleLevel >= 8);
            recipients.push(...adminEmployees.map(emp => ({
                recipientType: 'Employee',
                recipientRef: emp._id,
                preferredChannels: ['in-app', 'email']
            })));
            break;

        default:
            if (recipientType.startsWith('department:')) {
                const departmentId = recipientType.split(':')[1];
                const deptEmployees = await Employee.find({
                    companyRef,
                    departmentRef: departmentId,
                    'status.employeeStatus': 'Active'
                }).select('_id');

                recipients.push(...deptEmployees.map(emp => ({
                    recipientType: 'Employee',
                    recipientRef: emp._id,
                    preferredChannels: ['in-app']
                })));
            } else if (recipientType.startsWith('role:')) {
                const roleId = recipientType.split(':')[1];
                const roleEmployees = await Employee.find({
                    companyRef,
                    roleRef: roleId,
                    'status.employeeStatus': 'Active'
                }).select('_id');

                recipients.push(...roleEmployees.map(emp => ({
                    recipientType: 'Employee',
                    recipientRef: emp._id,
                    preferredChannels: ['in-app']
                })));
            }
            break;
    }

    return recipients;
};

// Send Notification
export const sendNotification = async (notificationId) => {
    try {
        const notification = await Notification.findById(notificationId)
            .populate('companyRef', 'companyName')
            .populate({
                path: 'recipients.primaryRecipient.recipientRef',
                model: 'Employee', // Explicitly state the model
                select: 'personalInfo.firstName personalInfo.lastName contactInfo.primaryEmail' // Get only what you need
            });

        if (!notification) {
            throw new ApiError(404, 'Notification not found');
        }

        // Check if already sent
        if (notification.delivery.sentAt) {
            return { success: true, message: 'Notification already sent' };
        }

        const results = {
            inApp: { success: 0, failed: 0 },
            email: { success: 0, failed: 0 }
        };

        // Send in-app notifications (update database)
        if (notification.delivery.channels.includes('in-app')) {
            await sendInAppNotifications(notification);
            results.inApp.success = notification.recipients.length;
        }

        // Send email notifications
        if (notification.delivery.channels.includes('email')) {
            const emailResults = await sendEmailNotifications(notification);
            results.email = emailResults;
        }

        // Update notification status
        await Notification.findByIdAndUpdate(notificationId, {
            'delivery.sentAt': new Date(),
            'delivery.status': 'Sent',
            'analytics.deliveryResults': results
        });

        return { success: true, results };

    } catch (error) {
        // Update notification with error
        await Notification.findByIdAndUpdate(notificationId, {
            'delivery.status': 'Failed',
            'delivery.errorMessage': error.message
        });

        throw new ApiError(500, `Failed to send notification: ${error.message}`);
    }
};

// Send In-App Notifications
const sendInAppNotifications = async (notification) => {
    try {
        // Mark as delivered for all recipients
        const updatePromises = notification.recipients.map(recipient =>
            Notification.updateOne(
                {
                    _id: notification._id,
                    'recipients.recipientRef': recipient.recipientRef._id
                },
                {
                    $set: {
                        'recipients.$.deliveryStatus.inApp.status': 'Delivered',
                        'recipients.$.deliveryStatus.inApp.deliveredAt': new Date()
                    }
                }
            )
        );

        await Promise.all(updatePromises);
        return true;

    } catch (error) {
        console.error('Failed to send in-app notifications:', error);
        throw error;
    }
};

// Send Email Notifications
const sendEmailNotifications = async (notification) => {
    try {
        const emailPromises = [];
        let successCount = 0;
        let failedCount = 0;

        for (const recipient of notification.recipients) {
            if (recipient.preferredChannels.includes('email') && recipient.recipientRef.contactInfo?.primaryEmail) {
                const emailPromise = sendEmail({
                    to: recipient.recipientRef.contactInfo.primaryEmail,
                    currentTemplate: 'notification',
                    data: {
                        companyName: notification.companyRef.companyName,
                        title: notification.content.title,
                        message: notification.content.message,
                        recipientName: `${recipient.recipientRef.personalInfo.firstName} ${recipient.recipientRef.personalInfo.lastName}`,
                        actionUrl: notification.interaction.actionUrl,
                        actionText: notification.interaction.actionText
                    }
                });

                emailPromises.push(
                    emailPromise
                        .then(() => {
                            successCount++;
                            return { success: true, recipient: recipient.recipientRef._id };
                        })
                        .catch(error => {
                            failedCount++;
                            return { success: false, recipient: recipient.recipientRef._id, error: error.message };
                        })
                );
            }
        }

        await Promise.all(emailPromises);

        return { success: successCount, failed: failedCount };

    } catch (error) {
        console.error('Failed to send email notifications:', error);
        return { success: 0, failed: notification.recipients.length };
    }
};

// Get User Notifications
export const getUserNotifications = async (employeeId, options = {}) => {
    try {
        const {
            page = 1,
            limit = 20,
            unreadOnly = false,
            category,
            type,
            priority
        } = options;

        const skip = (page - 1) * limit;

        // Build query
        const query = {
            'recipients.recipientRef': employeeId,
            'delivery.sentAt': { $exists: true },
            $or: [
                { 'delivery.expiresAt': { $exists: false } },
                { 'delivery.expiresAt': { $gt: new Date() } }
            ]
        };

        if (unreadOnly) {
            query['recipients.readAt'] = { $exists: false };
        }

        if (category) {
            query['content.category'] = category;
        }

        if (type) {
            query['content.type'] = type;
        }

        if (priority) {
            query['delivery.priority'] = priority;
        }

        const notifications = await Notification.find(query)
            .populate('companyRef', 'companyName')
            .sort({ 'delivery.sentAt': -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count
        const total = await Notification.countDocuments(query);

        // Process notifications for user
        const processedNotifications = notifications.map(notification => {
            const userRecipient = notification.recipients.find(
                r => r.recipientRef.toString() === employeeId.toString()
            );

            return {
                _id: notification._id,
                title: notification.content.title,
                message: notification.content.message,
                type: notification.content.type,
                category: notification.content.category,
                priority: notification.delivery.priority,
                actionRequired: notification.interaction.actionRequired,
                actionUrl: notification.interaction.actionUrl,
                actionText: notification.interaction.actionText,
                sentAt: notification.delivery.sentAt,
                readAt: userRecipient?.readAt,
                acknowledgedAt: userRecipient?.acknowledgedAt,
                isRead: !!userRecipient?.readAt,
                isAcknowledged: !!userRecipient?.acknowledgedAt
            };
        });

        return {
            notifications: processedNotifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalNotifications: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get user notifications: ${error.message}`);
    }
};

// Mark Notification as Read
export const markAsRead = async (notificationId, employeeId) => {
    try {
        const result = await Notification.updateOne(
            {
                _id: notificationId,
                'recipients.recipientRef': employeeId
            },
            {
                $set: {
                    'recipients.$.readAt': new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new ApiError(404, 'Notification not found or access denied');
        }

        return { success: true };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to mark notification as read: ${error.message}`);
    }
};

// Mark Notification as Acknowledged
export const markAsAcknowledged = async (notificationId, employeeId) => {
    try {
        const result = await Notification.updateOne(
            {
                _id: notificationId,
                'recipients.recipientRef': employeeId
            },
            {
                $set: {
                    'recipients.$.acknowledgedAt': new Date(),
                    'recipients.$.readAt': new Date() // Also mark as read
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new ApiError(404, 'Notification not found or access denied');
        }

        return { success: true };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to acknowledge notification: ${error.message}`);
    }
};

// Get Notification Stats
export const getNotificationStats = async (employeeId) => {
    try {
        const stats = await Notification.aggregate([
            {
                $match: {
                    'recipients.recipientRef': employeeId,
                    'delivery.sentAt': { $exists: true }
                }
            },
            {
                $unwind: '$recipients'
            },
            {
                $match: {
                    'recipients.recipientRef': employeeId
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    unread: {
                        $sum: {
                            $cond: [
                                { $exists: ['$recipients.readAt', false] },
                                1,
                                0
                            ]
                        }
                    },
                    actionRequired: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$interaction.actionRequired', true] },
                                        { $not: { $exists: ['$recipients.acknowledgedAt', true] } }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || { total: 0, unread: 0, actionRequired: 0 };

        return {
            total: result.total,
            unread: result.unread,
            read: result.total - result.unread,
            actionRequired: result.actionRequired
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get notification stats: ${error.message}`);
    }
};

// Send Bulk Notifications
export const sendBulkNotifications = async (notifications) => {
    try {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const notificationData of notifications) {
            try {
                await createNotification(notificationData);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    notification: notificationData.title,
                    error: error.message
                });
            }
        }

        return results;

    } catch (error) {
        throw new ApiError(500, `Failed to send bulk notifications: ${error.message}`);
    }
};

// Cleanup Old Notifications
export const cleanupOldNotifications = async (daysOld = 90) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await Notification.deleteMany({
            'delivery.sentAt': { $lt: cutoffDate },
            'delivery.expiresAt': { $lt: new Date() }
        });

        console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`);
        return { cleaned: result.deletedCount };

    } catch (error) {
        console.error('Failed to cleanup old notifications:', error);
        return { cleaned: 0, error: error.message };
    }
};