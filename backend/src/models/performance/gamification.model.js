// backend/src/models/performance/gamification.model.js

import mongoose from 'mongoose';
import { GAMIFICATION_SETTINGS } from '../../../shared/constants/gamificationConstants.js';

const pointHistorySchema = new mongoose.Schema({
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    taskRef: { type: mongoose.Schema.Types.ObjectId, ref: 'ClaimTask' },
    earnedAt: { type: Date, default: Date.now },
    category: { type: String, enum: ['task', 'achievement', 'bonus', 'streak', 'other'] }
}, { _id: false });

const levelHistorySchema = new mongoose.Schema({
    level: { type: Number, required: true },
    achievedAt: { type: Date, default: Date.now },
    totalPointsAtLevel: { type: Number, required: true }
}, { _id: false });

const unlockedAchievementSchema = new mongoose.Schema({
    achievementRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true
    },
    unlockedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const streakSchema = new mongoose.Schema({
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
}, { _id: false });

const gamificationSchema = new mongoose.Schema({
    // MAIN RELATIONSHIPS
    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true,
        index: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true,
    },

    // Points & Layering System
    points: {
        totalPoints: { type: Number, default: 0, min: 0 },
        currentMonthPoints: { type: Number, default: 0, min: 0 },
        currentWeekPoints: { type: Number, default: 0, min: 0 },
        pointsHistory: {
            type: [pointHistorySchema],
            default: []
        },
        // Optional: To keep a historical record of monthly/weekly points
        monthlyHistory: [{
            month: Number,
            year: Number,
            points: Number,
            resetAt: Date
        }],
        weeklyHistory: [{
            week: Number,
            year: Number,
            points: Number,
            resetAt: Date
        }]
    },

    level: {
        currentLevel: { type: Number, default: 1, min: 1 },
        currentLevelPoints: { type: Number, default: 0 }, // Points earned within the current level
        levelHistory: {
            type: [levelHistorySchema],
            default: []
        }
    },

    // Achievements and Progress
    achievements: {
        unlockedAchievements: {
            type: [unlockedAchievementSchema],
            default: []
        },
    },

    // Streaks for consistent performance
    streaks: {
        dailyTask: streakSchema,
        qualityStreak: streakSchema,
        slaStreak: streakSchema,
        loginStreak: streakSchema,
    },

    // Aggregated performance statistics
    statistics: {
        totalTasksCompleted: { type: Number, default: 0 },
        averageTaskTime: { type: Number, default: 0 }, // in seconds or minutes
        qualityScore: { type: Number, default: 0, min: 0, max: 100 },
        slaCompliance: { type: Number, default: 0, min: 0, max: 100 },
        lastActivity: { type: Date, default: Date.now }
    }
}, { timestamps: true, });

// Middleware to cap the points history array to save space
gamificationSchema.pre('save', function (next) {
    if (this.points.pointsHistory.length > GAMIFICATION_SETTINGS.POINT_HISTORY_LIMIT) {
        this.points.pointsHistory = this.points.pointsHistory.slice(-GAMIFICATION_SETTINGS.POINT_HISTORY_LIMIT);
    }
    next();
});

export const Gamification = mongoose.model('Gamification', gamificationSchema, 'gamification_records');