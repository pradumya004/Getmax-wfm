// backend/src/models/performance.model.js

import mongoose from 'mongoose';

// Performance Metrics Schema
const performanceMetricsSchema = new mongoose.Schema({
    // Daily Performance Tracking
    dailyMetrics: [{
        date: {
            type: Date,
            // required: true
        },
        tasksAssigned: {
            type: Number,
            default: 0,
            min: [0, 'Tasks assigned cannot be negative']
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Tasks completed cannot be negative']
        },
        tasksInProgress: {
            type: Number,
            default: 0,
            min: [0, 'Tasks in progress cannot be negative']
        },
        qualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100%'],
            default: null
        },
        productivityRate: {
            type: Number,
            min: [0, 'Productivity rate cannot be negative'],
            default: 0 // Tasks per hour
        },
        hoursWorked: {
            type: Number,
            min: [0, 'Hours worked cannot be negative'],
            max: [24, 'Hours worked cannot exceed 24 in a day'],
            default: 0
        },
        overtimeHours: {
            type: Number,
            min: [0, 'Overtime hours cannot be negative'],
            default: 0
        },
        slaComplianceRate: {
            type: Number,
            min: [0, 'SLA compliance cannot be negative'],
            max: [100, 'SLA compliance cannot exceed 100%'],
            default: null
        },
        errorRate: {
            type: Number,
            min: [0, 'Error rate cannot be negative'],
            max: [100, 'Error rate cannot exceed 100%'],
            default: null
        }
    }],

    // Weekly Aggregated Metrics
    weeklyMetrics: [{
        weekStart: {
            type: Date,
            // required: true
        },
        weekEnd: {
            type: Date,
            // required: true
        },
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        averageProductivityRate: {
            type: Number,
            default: 0
        },
        totalHoursWorked: {
            type: Number,
            default: 0
        },
        averageSlaCompliance: {
            type: Number,
            min: [0, 'Average SLA compliance cannot be negative'],
            max: [100, 'Average SLA compliance cannot exceed 100%'],
            default: null
        },
        weeklyRank: {
            type: Number,
            min: [1, 'Weekly rank must be at least 1'],
            default: null
        }
    }],

    // Monthly Performance Summary
    monthlyMetrics: [{
        month: {
            type: String,
            // required: true // Format: "2024-01"
        },
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        totalHoursWorked: {
            type: Number,
            default: 0
        },
        productivityImprovement: {
            type: Number,
            default: 0 // Percentage improvement from previous month
        },
        goalsAchieved: {
            type: Number,
            default: 0
        },
        goalsTotal: {
            type: Number,
            default: 0
        },
        monthlyRating: {
            type: String,
            enum: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Below Expectations", "Needs Improvement"],
            default: null
        },
        bonusEarned: {
            type: Number,
            default: 0,
            min: [0, 'Bonus cannot be negative']
        }
    }],

    // Overall Performance Stats
    overallStats: {
        totalTasksCompleted: {
            type: Number,
            default: 0
        },
        averageQualityScore: {
            type: Number,
            min: [0, 'Average quality score cannot be negative'],
            max: [100, 'Average quality score cannot exceed 100%'],
            default: null
        },
        currentStreak: {
            type: Number,
            default: 0 // Days of consecutive goal achievement
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        totalExperiencePoints: {
            type: Number,
            default: 0,
            min: [0, 'Experience points cannot be negative']
        },
        currentLevel: {
            type: Number,
            default: 1,
            min: [1, 'Level must be at least 1']
        },
        badges: [{
            badgeName: {
                type: String,
                enum: [
                    "First Task", "Speed Demon", "Quality Champion", "Consistency King",
                    "Problem Solver", "Team Player", "Mentor", "Innovation Star",
                    "Customer Favorite", "Perfect Week", "Monthly Star", "Annual Champion"
                ]
            },
            earnedDate: {
                type: Date,
                default: Date.now
            },
            description: String
        }],
        performanceHistory: [{
            evaluationDate: {
                type: Date,
                // required: true
            },
            evaluatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
                // required: true
            },
            overallRating: {
                type: String,
                enum: ["Outstanding", "Exceeds Expectations", "Meets Expectations", "Below Expectations", "Needs Improvement"],
                // required: true
            },
            strengths: [String],
            improvementAreas: [String],
            goals: [String],
            feedback: String
        }]
    }
}, { _id: false });

export default performanceMetricsSchema;