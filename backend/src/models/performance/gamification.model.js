// backend/src/models/performance/gamification.model.js

import mongoose from 'mongoose';

const gamificationSchema = new mongoose.Schema({
    // Experience & Leveling
    experience: {
        totalXP: { type: Number, default: 0, min: 0 },
        currentLevel: { type: Number, default: 1, min: 1 },
        xpToNextLevel: { type: Number, default: 100 },
        levelUpHistory: [{ level: Number, achievedDate: Date, xpRequired: Number }]
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
        unlockedDate: { type: Date, default: Date.now },
        rarity: { type: String, enum: ["Common", "Rare", "Epic", "Legendary"], default: "Common" }
    }],

    // RCM Specific Achievements & Badges
    rcmAchievements: [{
        achievementId: String,
        name: String,
        description: String,
        category: {
            type: String,
            enum: [
                "Claims Processing", "EDI Management", "QA Excellence", "SLA Performance",
                "Financial Performance", "Denial Management", "Patient Services", "Clearinghouse Operations",
                "Workflow Efficiency", "Revenue Optimization", "Compliance", "Team Leadership"
            ]
        },
        rcmType: {
            type: String,
            enum: [
                "VOLUME_MILESTONE", "QUALITY_THRESHOLD", "SPEED_BENCHMARK", "DENIAL_RATE",
                "FIRST_PASS_RATE", "CLEAN_CLAIM_RATE", "AR_DAYS", "COLLECTION_RATE",
                "SLA_COMPLIANCE", "QA_SCORE", "STREAK_ACHIEVEMENT", "SPECIAL_RECOGNITION"
            ]
        },
        metrics: {
            threshold: Number,
            timeframe: { type: String, enum: ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly", "All Time"] },
            operator: { type: String, enum: [">=", "<=", "=", ">", "<"], default: ">=" }
        },
        xpAwarded: Number,
        unlockedDate: { type: Date, default: Date.now },
        rarity: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"], default: "Bronze" },
        badge: { icon: String, color: String, description: String },
        progress: {
            current: { type: Number, default: 0 },
            target: Number,
            percentage: { type: Number, default: 0 }
        }
    }],

    // Leaderboards & Rankings
    rankings: {
        currentWeekRank: { type: Number, default: null },
        currentMonthRank: { type: Number, default: null },
        bestWeekRank: { type: Number, default: null },
        bestMonthRank: { type: Number, default: null },
        departmentRank: { type: Number, default: null },
        companyRank: { type: Number, default: null },
        rcmRankings: {
            claimsProcessingRank: { type: Number, default: null },
            qaScoreRank: { type: Number, default: null },
            slaComplianceRank: { type: Number, default: null },
            financialPerformanceRank: { type: Number, default: null },
            denialRateRank: { type: Number, default: null },
            patientServicesRank: { type: Number, default: null },
            clearinghouseOperationsRank: { type: Number, default: null },
            workflowEfficiencyRank: { type: Number, default: null },
            revenueOptimizationRank: { type: Number, default: null },
            teamLeadershipRank: { type: Number, default: null }
        }
    },

    // Streaks & Milestones
    streaks: {
        currentTaskStreak: { type: Number, default: 0 },
        longestTaskStreak: { type: Number, default: 0 },
        currentQualityStreak: { type: Number, default: 0 },
        longestQualityStreak: { type: Number, default: 0 },
        loginStreak: { type: Number, default: 0 },
        longestLoginStreak: { type: Number, default: 0 },
        rcmStreaks: {
            cleanClaimStreak: { type: Number, default: 0 },
            longestCleanClaimStreak: { type: Number, default: 0 },
            slaComplianceStreak: { type: Number, default: 0 },
            longestSlaComplianceStreak: { type: Number, default: 0 },
            qaPassStreak: { type: Number, default: 0 },
            longestQaPassStreak: { type: Number, default: 0 },
            denialFreeStreak: { type: Number, default: 0 },
            longestDenialFreeStreak: { type: Number, default: 0 }
        }

    },

    // Rewards and Recognition
    rewards: [{
        rewardType: { type: String, enum: ["Badge", "Certificate", "Monetary", "Time Off", "Recognition", "Gift"] },
        rewardName: String,
        description: String,
        value: Number,
        earnedDate: { type: Date, default: Date.now },
        status: { type: String, enum: ["Earned", "Claimed", "Expired"], default: "Earned" }
    }],

    // 🆕 RCM Performance Milestones
    rcmMilestones: {
        totalClaimsProcessed: { type: Number, default: 0 },
        totalCleanClaims: { type: Number, default: 0 },
        totalDenialsHandled: { type: Number, default: 0 },
        totalPaymentsPosted: { type: Number, default: 0 },
        totalQaReviews: { type: Number, default: 0 },
        milestoneHistory: [{
            milestone: {
                type: String,
                enum: [
                    "FIRST_CLAIM", "100_CLAIMS", "500_CLAIMS", "1000_CLAIMS", "5000_CLAIMS",
                    "FIRST_CLEAN_CLAIM", "100_CLEAN_CLAIMS", "90_PERCENT_CLEAN_RATE",
                    "95_PERCENT_CLEAN_RATE", "99_PERCENT_CLEAN_RATE",
                    "FIRST_QA_PASS", "100_QA_PASSES", "90_PERCENT_QA_RATE",
                    "FIRST_SLA_COMPLIANCE", "100_SLA_COMPLIANCES", "ZERO_DENIALS_MONTH"
                ]
            },
            achievedDate: { type: Date, default: Date.now },
            xpAwarded: Number,
            value: Number
        }]
    }
}, { _id: false });

// 🆕 RCM Achievement Calculation Methods
gamificationSchema.methods.calculateRcmAchievementProgress = function (achievementId, currentValue) {
    const achievement = this.rcmAchievements.find(a => a.achievementId === achievementId);
    if (achievement) {
        achievement.progress.current = currentValue;
        achievement.progress.percentage = Math.min(100, Math.round((currentValue / achievement.progress.target) * 100));

        if (achievement.progress.percentage >= 100 && !achievement.unlockedDate) {
            achievement.unlockedDate = new Date();
            return { unlocked: true, achievement };
        }
    }
    return { unlocked: false };
};

gamificationSchema.methods.updateRcmStreak = function (streakType, success) {
    const streakPath = `rcmStreaks.${streakType}`;
    const longestStreakPath = `rcmStreaks.longest${streakType.charAt(0).toUpperCase() + streakType.slice(1)}`;

    if (success) {
        this.rcmStreaks[streakType]++;
        if (this.rcmStreaks[streakType] > this.rcmStreaks[`longest${streakType.charAt(0).toUpperCase() + streakType.slice(1)}`]) {
            this.rcmStreaks[`longest${streakType.charAt(0).toUpperCase() + streakType.slice(1)}`] = this.rcmStreaks[streakType];
        }
    } else {
        this.rcmStreaks[streakType] = 0;
    }
};

gamificationSchema.methods.awardRcmMilestone = function (milestone, value, xpPoints) {
    const existingMilestone = this.rcmMilestones.milestoneHistory.find(m => m.milestone === milestone);

    if (!existingMilestone) {
        this.rcmMilestones.milestoneHistory.push({
            milestone,
            achievedDate: new Date(),
            xpAwarded: xpPoints,
            value
        });

        // Update counters
        switch (milestone) {
            case 'FIRST_CLAIM':
            case '100_CLAIMS':
            case '500_CLAIMS':
            case '1000_CLAIMS':
            case '5000_CLAIMS':
                this.rcmMilestones.totalClaimsProcessed = value;
                break;
            case 'FIRST_CLEAN_CLAIM':
            case '100_CLEAN_CLAIMS':
                this.rcmMilestones.totalCleanClaims = value;
                break;
            case 'FIRST_QA_PASS':
            case '100_QA_PASSES':
                this.rcmMilestones.totalQaReviews = value;
                break;
        }

        return true;
    }
    return false;
};

export default gamificationSchema;