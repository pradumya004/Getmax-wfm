// shared/constants/gamificationConstants.js

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
    PRODUCTIVITY: 'productivity',
    QUALITY: 'quality',
    SLA: 'sla',
    MILESTONE: 'milestone'
};

// Achievement Definitions
export const ACHIEVEMENTS = {
    // Productivity Achievements
    TASK_MASTER: {
        id: 'task_master',
        name: 'Task Master',
        description: 'Complete 100 tasks in a month',
        category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
        icon: '🎯',
        points: 500,
        criteria: { taskCount: 100, period: 'month' },
        rarity: 'rare'
    },
    SPEED_DEMON: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete 10 tasks in a single day',
        category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
        icon: '⚡',
        points: 200,
        criteria: { taskCount: 10, period: 'day' },
        rarity: 'common'
    },
    CONSISTENCY_KING: {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Complete tasks for 30 consecutive days',
        category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
        icon: '👑',
        points: 750,
        criteria: { consecutiveDays: 30 },
        rarity: 'epic'
    },
    EARLY_BIRD: {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete 5 tasks before 9 AM',
        category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
        icon: '🌅',
        points: 150,
        criteria: { earlyTaskCount: 5, timeBefore: '09:00' },
        rarity: 'common'
    },
    NIGHT_OWL: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete 5 tasks after 6 PM',
        category: ACHIEVEMENT_CATEGORIES.PRODUCTIVITY,
        icon: '🦉',
        points: 150,
        criteria: { lateTaskCount: 5, timeAfter: '18:00' },
        rarity: 'common'
    },

    // Quality Achievements
    PERFECTIONIST: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Maintain 100% accuracy for 50 consecutive tasks',
        category: ACHIEVEMENT_CATEGORIES.QUALITY,
        icon: '💎',
        points: 1000,
        criteria: { accuracyRate: 100, consecutiveTasks: 50 },
        rarity: 'legendary'
    },
    QUALITY_GUARDIAN: {
        id: 'quality_guardian',
        name: 'Quality Guardian',
        description: 'Maintain 98%+ accuracy for a month',
        category: ACHIEVEMENT_CATEGORIES.QUALITY,
        icon: '🛡️',
        points: 600,
        criteria: { accuracyRate: 98, period: 'month' },
        rarity: 'rare'
    },
    ERROR_FREE: {
        id: 'error_free',
        name: 'Error-Free Week',
        description: 'Complete a week without any errors',
        category: ACHIEVEMENT_CATEGORIES.QUALITY,
        icon: '✨',
        points: 300,
        criteria: { errorCount: 0, period: 'week' },
        rarity: 'uncommon'
    },
    DETAIL_ORIENTED: {
        id: 'detail_oriented',
        name: 'Detail Oriented',
        description: 'Complete 20 tasks with zero quality issues',
        category: ACHIEVEMENT_CATEGORIES.QUALITY,
        icon: '🔍',
        points: 250,
        criteria: { perfectTasks: 20 },
        rarity: 'uncommon'
    },

    // SLA Achievements
    SLA_CHAMPION: {
        id: 'sla_champion',
        name: 'SLA Champion',
        description: 'Meet 100% SLA compliance for a month',
        category: ACHIEVEMENT_CATEGORIES.SLA,
        icon: '🏆',
        points: 800,
        criteria: { slaCompliance: 100, period: 'month' },
        rarity: 'epic'
    },
    DEADLINE_WARRIOR: {
        id: 'deadline_warrior',
        name: 'Deadline Warrior',
        description: 'Submit 25 tasks before deadline',
        category: ACHIEVEMENT_CATEGORIES.SLA,
        icon: '⏰',
        points: 400,
        criteria: { earlySubmissions: 25 },
        rarity: 'uncommon'
    },
    TIME_MASTER: {
        id: 'time_master',
        name: 'Time Master',
        description: 'Complete 50 tasks within 80% of allocated time',
        category: ACHIEVEMENT_CATEGORIES.SLA,
        icon: '⏱️',
        points: 350,
        criteria: { timeEfficiencyTasks: 50, timeEfficiency: 80 },
        rarity: 'uncommon'
    },
    NEVER_LATE: {
        id: 'never_late',
        name: 'Never Late',
        description: 'Complete 100 tasks without missing a single deadline',
        category: ACHIEVEMENT_CATEGORIES.SLA,
        icon: '🎯',
        points: 500,
        criteria: { onTimeTasks: 100 },
        rarity: 'rare'
    },

    // Milestone Achievements
    FIRST_TASK: {
        id: 'first_task',
        name: 'First Steps',
        description: 'Complete your first task',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '🎉',
        points: 50,
        criteria: { taskCount: 1 },
        rarity: 'common'
    },
    GETTING_STARTED: {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Complete 10 tasks total',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '🚀',
        points: 100,
        criteria: { totalTasks: 10 },
        rarity: 'common'
    },
    ON_A_ROLL: {
        id: 'on_a_roll',
        name: 'On a Roll',
        description: 'Complete 50 tasks total',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '🔥',
        points: 300,
        criteria: { totalTasks: 50 },
        rarity: 'uncommon'
    },
    CENTURY_CLUB: {
        id: 'century_club',
        name: 'Century Club',
        description: 'Complete 100 tasks total',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '💯',
        points: 1000,
        criteria: { totalTasks: 100 },
        rarity: 'rare'
    },
    HALF_K_HERO: {
        id: 'half_k_hero',
        name: 'Half-K Hero',
        description: 'Complete 500 tasks total',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '⭐',
        points: 2500,
        criteria: { totalTasks: 500 },
        rarity: 'epic'
    },
    VETERAN: {
        id: 'veteran',
        name: 'Veteran',
        description: 'Complete 1000 tasks total',
        category: ACHIEVEMENT_CATEGORIES.MILESTONE,
        icon: '🎖️',
        points: 5000,
        criteria: { totalTasks: 1000 },
        rarity: 'legendary'
    }
};

// Level System
export const LEVEL_SYSTEM = {
    1: {
        name: 'Rookie',
        minPoints: 0,
        maxPoints: 499,
        badge: '🥉',
        color: '#CD7F32',
        description: 'Just getting started on your journey'
    },
    2: {
        name: 'Apprentice',
        minPoints: 500,
        maxPoints: 1499,
        badge: '🥈',
        color: '#C0C0C0',
        description: 'Learning the ropes and building skills'
    },
    3: {
        name: 'Professional',
        minPoints: 1500,
        maxPoints: 3499,
        badge: '🥇',
        color: '#FFD700',
        description: 'Competent and reliable performer'
    },
    4: {
        name: 'Expert',
        minPoints: 3500,
        maxPoints: 7499,
        badge: '⭐',
        color: '#FF6B35',
        description: 'Skilled professional with proven expertise'
    },
    5: {
        name: 'Master',
        minPoints: 7500,
        maxPoints: 14999,
        badge: '🌟',
        color: '#4ECDC4',
        description: 'Highly skilled with exceptional performance'
    },
    6: {
        name: 'Champion',
        minPoints: 15000,
        maxPoints: 29999,
        badge: '💫',
        color: '#9B59B6',
        description: 'Outstanding performer and team leader'
    },
    7: {
        name: 'Legend',
        minPoints: 30000,
        maxPoints: 59999,
        badge: '🏆',
        color: '#E74C3C',
        description: 'Legendary status with remarkable achievements'
    },
    8: {
        name: 'Mythic',
        minPoints: 60000,
        maxPoints: 99999,
        badge: '👑',
        color: '#8E44AD',
        description: 'Mythical level of excellence and leadership'
    },
    9: {
        name: 'Supreme',
        minPoints: 100000,
        maxPoints: 199999,
        badge: '💎',
        color: '#2C3E50',
        description: 'Supreme mastery of all aspects'
    },
    10: {
        name: 'Godlike',
        minPoints: 200000,
        maxPoints: Infinity,
        badge: '🔥',
        color: '#FF0000',
        description: 'Transcendent performance beyond measure'
    }
};

// Achievement Rarity System
export const ACHIEVEMENT_RARITY = {
    COMMON: {
        name: 'Common',
        color: '#95A5A6',
        multiplier: 1,
        description: 'Basic achievements that most employees can earn'
    },
    UNCOMMON: {
        name: 'Uncommon',
        color: '#27AE60',
        multiplier: 1.2,
        description: 'Achievements requiring consistent effort'
    },
    RARE: {
        name: 'Rare',
        color: '#3498DB',
        multiplier: 1.5,
        description: 'Challenging achievements for dedicated performers'
    },
    EPIC: {
        name: 'Epic',
        color: '#9B59B6',
        multiplier: 2,
        description: 'Exceptional achievements requiring sustained excellence'
    },
    LEGENDARY: {
        name: 'Legendary',
        color: '#E67E22',
        multiplier: 3,
        description: 'Elite achievements for top performers'
    }
};

// Point Values
export const POINT_VALUES = {
    // Task Completion Points
    TASK_COMPLETION: {
        LOW_PRIORITY: 10,
        MEDIUM_PRIORITY: 15,
        HIGH_PRIORITY: 25,
        URGENT: 40
    },

    // Bonus Points
    EARLY_COMPLETION: 5,
    PERFECT_QUALITY: 10,
    FIRST_TRY_SUCCESS: 15,
    HELP_COLLEAGUE: 20,

    // Time-based Bonuses
    WEEKEND_WORK: 25,
    HOLIDAY_WORK: 50,
    OVERTIME_COMPLETION: 20,

    // Streak Bonuses
    DAILY_STREAK_BONUS: 2,
    WEEKLY_STREAK_BONUS: 15,
    MONTHLY_STREAK_BONUS: 100
};

// Leaderboard Types
export const LEADERBOARD_TYPES = {
    POINTS: 'points',
    LEVEL: 'level',
    ACHIEVEMENTS: 'achievements',
    STREAK: 'streak',
    MONTHLY_POINTS: 'monthly_points',
    WEEKLY_POINTS: 'weekly_points'
};

// Leaderboard Periods
export const LEADERBOARD_PERIODS = {
    ALL_TIME: 'all_time',
    CURRENT_MONTH: 'current_month',
    CURRENT_WEEK: 'current_week',
    TODAY: 'today',
    LAST_MONTH: 'last_month',
    LAST_WEEK: 'last_week'
};

// Notification Types for Gamification
export const GAMIFICATION_NOTIFICATION_TYPES = {
    LEVEL_UP: 'level_up',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    STREAK_MILESTONE: 'streak_milestone',
    LEADERBOARD_POSITION: 'leaderboard_position',
    POINTS_MILESTONE: 'points_milestone'
};

// Streak Types
export const STREAK_TYPES = {
    DAILY_TASK: 'daily_task',
    QUALITY_STREAK: 'quality_streak',
    SLA_STREAK: 'sla_streak',
    LOGIN_STREAK: 'login_streak'
};

// Time Period Constants
export const TIME_PERIODS = {
    CURRENT_DAY: 'current_day',
    CURRENT_WEEK: 'current_week',
    CURRENT_MONTH: 'current_month',
    CURRENT_QUARTER: 'current_quarter',
    CURRENT_YEAR: 'current_year',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'last_90_days',
    CUSTOM: 'custom'
};

// Badge Collections
export const BADGE_COLLECTIONS = {
    PRODUCTIVITY: {
        name: 'Productivity Masters',
        description: 'Achievements focused on task completion and efficiency',
        icon: '🎯',
        achievements: ['task_master', 'speed_demon', 'consistency_king', 'early_bird', 'night_owl']
    },
    QUALITY: {
        name: 'Quality Champions',
        description: 'Achievements focused on accuracy and excellence',
        icon: '💎',
        achievements: ['perfectionist', 'quality_guardian', 'error_free', 'detail_oriented']
    },
    TIMELINESS: {
        name: 'Time Masters',
        description: 'Achievements focused on meeting deadlines and SLA compliance',
        icon: '⏰',
        achievements: ['sla_champion', 'deadline_warrior', 'time_master', 'never_late']
    },
    MILESTONES: {
        name: 'Journey Markers',
        description: 'Achievements marking important milestones in your career',
        icon: '🏁',
        achievements: ['first_task', 'getting_started', 'on_a_roll', 'century_club', 'half_k_hero', 'veteran']
    }
};

// Gamification Settings
export const GAMIFICATION_SETTINGS = {
    MAX_DAILY_POINTS: 500,
    MAX_WEEKLY_POINTS: 2000,
    MAX_MONTHLY_POINTS: 8000,
    STREAK_RESET_HOURS: 24,
    ACHIEVEMENT_NOTIFICATION_DELAY: 2000, // 2 seconds
    LEADERBOARD_UPDATE_INTERVAL: 300000, // 5 minutes
    POINT_HISTORY_LIMIT: 100
};

// UI Constants
export const UI_CONSTANTS = {
    COLORS: {
        PRIMARY: '#3498DB',
        SUCCESS: '#27AE60',
        WARNING: '#F39C12',
        DANGER: '#E74C3C',
        INFO: '#17A2B8',
        LIGHT: '#F8F9FA',
        DARK: '#343A40'
    },
    ANIMATIONS: {
        LEVEL_UP_DURATION: 3000,
        ACHIEVEMENT_POPUP_DURATION: 4000,
        POINT_ANIMATION_DURATION: 1000,
        CONFETTI_DURATION: 2000
    }
};

// Export all constants as a single object for easy importing
export const GAMIFICATION_CONSTANTS = {
    ACHIEVEMENT_CATEGORIES,
    ACHIEVEMENTS,
    LEVEL_SYSTEM,
    ACHIEVEMENT_RARITY,
    POINT_VALUES,
    LEADERBOARD_TYPES,
    LEADERBOARD_PERIODS,
    GAMIFICATION_NOTIFICATION_TYPES,
    STREAK_TYPES,
    TIME_PERIODS,
    BADGE_COLLECTIONS,
    GAMIFICATION_SETTINGS,
    UI_CONSTANTS
};

export default GAMIFICATION_CONSTANTS;