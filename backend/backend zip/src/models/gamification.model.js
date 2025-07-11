// backend/src/models/gamification.model.js

import mongoose from 'mongoose';

const gamificationSchema = new mongoose.Schema({
    // Experience & Leveling
    experience: {
        totalXP: {
            type: Number,
            default: 0,
            min: 0
        },
        currentLevel: {
            type: Number,
            default: 1,
            min: 1
        },
        xpToNextLevel: {
            type: Number,
            default: 100
        },
        levelUpHistory: [{
            level: Number,
            achievedDate: Date,
            xpRequired: Number
        }]
    },

    // Achievements & Badges
    achievements: [{
        achievementId: String,
        name: String,
        description: String,
        category: {
            type: String,
            enum: ["Productivity", "Quality", "Consistency", "Collaboration", "Innovation", "Learning"]
        },
        pointsAwarded: Number,
        unlockedDate: {
            type: Date,
            default: Date.now
        },
        rarity: {
            type: String,
            enum: ["Common", "Rare", "Epic", "Legendary"],
            default: "Common"
        }
    }],

    // Leaderboards & Rankings
    rankings: {
        currentWeekRank: {
            type: Number,
            default: null
        },
        currentMonthRank: {
            type: Number,
            default: null
        },
        bestWeekRank: {
            type: Number,
            default: null
        },
        bestMonthRank: {
            type: Number,
            default: null
        },
        departmentRank: {
            type: Number,
            default: null
        },
        companyRank: {
            type: Number,
            default: null
        }
    },

    // Streaks & Milestones
    streaks: {
        currentTaskStreak: {
            type: Number,
            default: 0
        },
        longestTaskStreak: {
            type: Number,
            default: 0
        },
        currentQualityStreak: {
            type: Number,
            default: 0
        },
        longestQualityStreak: {
            type: Number,
            default: 0
        },
        loginStreak: {
            type: Number,
            default: 0
        },
        longestLoginStreak: {
            type: Number,
            default: 0
        }
    },

    // Rewards and Recognition
    rewards: [{
        rewardType: {
            type: String,
            enum: ["Badge", "Certificate", "Monetary", "Time Off", "Recognition", "Gift"]
        },
        rewardName: String,
        description: String,
        value: Number,
        earnedDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["Earned", "Claimed", "Expired"],
            default: "Earned"
        }
    }]
}, { _id: false });

export default gamificationSchema;
