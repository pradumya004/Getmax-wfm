// backend/src/services/gamificationService.service.js

import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { Gamification } from '../models/gamification.model.js';
import { Employee } from '../models/core/employee.model.js';
import { ClaimTask } from '../models/workflow/claimtasks.model.js';
import { Performance } from '../models/performance.model.js';
import { createNotification } from './notificationService.js';
import {
    ACHIEVEMENTS,
    LEVEL_SYSTEM,
    POINT_VALUES,
    ACHIEVEMENT_RARITY,
    LEADERBOARD_TYPES,
    LEADERBOARD_PERIODS,
    GAMIFICATION_NOTIFICATION_TYPES,
    STREAK_TYPES,
    TIME_PERIODS,
    GAMIFICATION_SETTINGS
} from '../../../shared/constants/gamificationConstants.js';
import { getDateRange } from './../utils/dateUtils';

// Award Points
export const awardPoints = async (employeeId, points, reason, taskId = null, priority = 'MEDIUM_PRIORITY') => {
    const session = await mongoose.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const employee = await Employee.findById(employeeId).session(session);
            if (!employee) {
                throw new ApiError(404, 'Employee not found');
            }

            // Get or create gamification record
            let gamification = await Gamification.findOne({ employeeRef: employeeId }).session(session);
            if (!gamification) {
                gamification = await createInitialGamificationRecord(employeeId, employee.companyRef, session);
            }

            // Calculate old level
            const oldLevel = calculateLevel(gamification.points.totalPoints);

            // Apply daily points limit
            const today = new Date();
            const dailyPoints = getDailyPoints(gamification, today);
            let awardedPoints = points;

            if (dailyPoints + awardedPoints > GAMIFICATION_SETTINGS.MAX_DAILY_POINTS) {
                awardedPoints = Math.max(0, GAMIFICATION_SETTINGS.MAX_DAILY_POINTS - dailyPoints);
            }

            if (awardedPoints <= 0) {
                result = {
                    pointsAwarded: 0,
                    totalPoints: gamification.points.totalPoints,
                    currentLevel: oldLevel,
                    leveledUp: false,
                    message: 'Daily points limit reached.'
                };
                return;
            }

            // Add points
            gamification.points.totalPoints += awardedPoints;
            gamification.points.currentMonthPoints += awardedPoints;
            gamification.points.pointsHistory.push({
                points: awardedPoints,
                reason,
                taskRef: taskId,
                earnedAt: new Date(),
                category: getPointCategory(reason)
            });

            // Keep only last POINT_HISTORY_LIMIT point history entries
            if (gamification.points.pointsHistory.length > GAMIFICATION_SETTINGS.POINT_HISTORY_LIMIT) {
                gamification.points.pointsHistory.splice(0, gamification.points.pointsHistory.length - GAMIFICATION_SETTINGS.POINT_HISTORY_LIMIT);
            }

            // Update level
            const newLevel = calculateLevel(gamification.points.totalPoints);
            gamification.level.currentLevel = newLevel.level;
            gamification.level.currentLevelPoints = newLevel.pointsInLevel;

            // Check for level up
            if (newLevel.level > oldLevel.level) {
                await handleLevelUp(gamification, employee, newLevel, oldLevel, session);
            }

            await gamification.save({ session });

            // Check for new achievements
            const newAchievements = await checkAchievements(employeeId, session);
            await updateStreaks(employeeId, session);

            result = {
                pointsAwarded: awardedPoints,
                totalPoints: gamification.points.totalPoints,
                currentLevel: newLevel,
                leveledUp: newLevel.level > oldLevel.level,
                oldLevel: oldLevel.level,
                newLevel: newLevel.level,
                newAchievements
            };
        })
        return result;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to award points: ${error.message}`);
    } finally {
        await session.endSession();
    }
};

// Create Initial Gamification Record
const createInitialGamificationRecord = async (employeeId, companyId, session) => {
    const records = await Gamification.create([{
        employeeRef: employeeId,
        companyRef: companyId,
        points: {
            totalPoints: 0,
            currentMonthPoints: 0,
            currentWeekPoints: 0,
            pointsHistory: []
        },
        level: {
            currentLevel: 1,
            currentLevelPoints: 0,
            levelHistory: []
        },
        achievements: {
            unlockedAchievements: [],
            achievementProgress: {}
        },
        streaks: {
            dailyTask: { current: 0, longest: 0, lastUpdate: new Date() },
            qualityStreak: { current: 0, longest: 0, lastUpdate: new Date() },
            slaStreak: { current: 0, longest: 0, lastUpdate: new Date() },
            loginStreak: { current: 0, longest: 0, lastUpdate: new Date() }
        },
        statistics: {
            totalTasksCompleted: 0,
            averageTaskTime: 0,
            qualityScore: 0,
            slaCompliance: 0,
            lastActivity: new Date()
        }
    }], { session });

    return records[0];
};

// Handle Level Up
const handleLevelUp = async (gamification, employee, newLevel, oldLevel, session) => {
    gamification.level.levelHistory.push({
        level: newLevel.level,
        achievedAt: new Date(),
        totalPointsAtLevel: gamification.points.totalPoints
    });

    // Send level up notification
    await createNotification({
        companyRef: employee.companyRef,
        recipients: [{ type: 'Employee', id: employee._id }],
        title: `🎉 Level Up! You're now ${newLevel.name}!`,
        message: `Congratulations! You've reached level ${newLevel.level} (${newLevel.name}) with ${gamification.points.totalPoints} total points! ${newLevel.badge}`,
        type: GAMIFICATION_NOTIFICATION_TYPES.LEVEL_UP,
        category: 'Gamification',
        actionRequired: false,
        sendEmail: false,
        createdBy: employee._id,
        metadata: {
            oldLevel: oldLevel.level,
            newLevel: newLevel.level,
            totalPoints: gamification.points.totalPoints
        }
    }, { session });
};

// Calculate Level
const calculateLevel = (totalPoints) => {
    for (let level = 10; level >= 1; level--) {
        const levelInfo = LEVEL_SYSTEM[level];
        if (totalPoints >= levelInfo.minPoints) {
            return {
                level,
                name: levelInfo.name,
                badge: levelInfo.badge,
                color: levelInfo.color,
                description: levelInfo.description,
                minPoints: levelInfo.minPoints,
                maxPoints: levelInfo.maxPoints,
                pointsInLevel: totalPoints - levelInfo.minPoints,
                pointsToNext: level < 10 ? LEVEL_SYSTEM[level + 1].minPoints - totalPoints : 0,
                progressPercentage: level < 10 ? ((totalPoints - levelInfo.minPoints) / (LEVEL_SYSTEM[level + 1].minPoints - levelInfo.minPoints)) * 100 : 100
            };
        }
    }
    return {
        ...LEVEL_SYSTEM[1],
        level: 1,
        pointsInLevel: totalPoints,
        pointsToNext: LEVEL_SYSTEM[2].minPoints - totalPoints,
        progressPercentage: (totalPoints / (LEVEL_SYSTEM[2].minPoints - totalPoints)) * 100
    };
};

// Check Achievements
export const checkAchievements = async (employeeId, session) => {
    try {
        const employee = await Employee.findById(employeeId).session(session);
        if (!employee) return [];

        const gamification = await Gamification.findOne({ employeeRef: employeeId }).session(session);
        if (!gamification) return [];

        const newAchievements = [];

        // Check each achievement
        for (const achievement of Object.values(ACHIEVEMENTS)) {
            // Skip if already unlocked
            if (gamification.achievements.unlockedAchievements.some(a => a.achievementId === achievement.id)) {
                continue;
            }

            const isUnlocked = await checkAchievementCriteria(employeeId, achievement, gamification, session);
            if (isUnlocked) {
                // Calculate final points with rarity multiplier
                const rarity = ACHIEVEMENT_RARITY[achievement.rarity.toLowerCase()] || ACHIEVEMENT_RARITY.COMMON;
                const finalPoints = Math.round(achievement.points * rarity.multiplier);

                // Unlock achievement
                const unlockedAchievement = {
                    achievementId: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    points: finalPoints,
                    rarity: rarity.name,
                    unlockedAt: new Date()
                };

                gamification.achievements.unlockedAchievements.push(unlockedAchievement);

                // Award points for achievement
                gamification.points.totalPoints += finalPoints;
                gamification.points.pointsHistory.push({
                    points: finalPoints,
                    reason: `Achievement Unlocked: ${achievement.name}`,
                    earnedAt: new Date(),
                    category: 'achievement',
                    metadata: {
                        achievementId: achievement.id,
                        name: achievement.name,
                        description: achievement.description,
                        icon: achievement.icon,
                        points: finalPoints,
                        rarity: rarity.name,
                        unlockedAt: new Date()
                    }
                });

                newAchievements.push({
                    ...achievement,
                    pointsAwarded: finalPoints,
                    totalPoints: gamification.points.totalPoints,
                    unlockedAt: unlockedAchievement.unlockedAt
                });

                // Send achievement notification
                await createNotification({
                    companyRef: employee.companyRef,
                    recipients: [{ type: 'Employee', id: employeeId }],
                    title: `🏆 Achievement Unlocked: ${achievement.name}!`,
                    message: `${achievement.icon} ${achievement.description} (+${finalPoints} points)`,
                    type: GAMIFICATION_NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED,
                    category: 'Gamification',
                    actionRequired: false,
                    sendEmail: false,
                    createdBy: employeeId,
                    metadata: {
                        achievementId: achievement.id,
                        points: finalPoints,
                        rarity: achievement.rarity
                    }
                }, { session });
            }
        }

        if (newAchievements.length > 0) {
            await gamification.save({ session });
        }

        return newAchievements;

    } catch (error) {
        console.error('Failed to check achievements:', error);
        return [];
    }
};

// Check Achievement Criteria
const checkAchievementCriteria = async (employeeId, achievement, gamification, session) => {
    try {
        const criteria = achievement.criteria;

        switch (achievement.id) {
            case ACHIEVEMENTS[0].id:
                return await checkTaskCount(employeeId, criteria.taskCount, criteria.period, session);

            case ACHIEVEMENTS[1].id:
                return await checkTaskCount(employeeId, criteria.taskCount, criteria.period, session);

            case ACHIEVEMENTS[2].id:
                return await checkConsecutiveDays(employeeId, criteria.consecutiveDays, session);

            case ACHIEVEMENTS[3].id:
                return await checkTimeBasedTasks(employeeId, criteria.earlyTaskCount, 'before', criteria.timeBefore, session);

            case ACHIEVEMENTS[4].id:
                return await checkTimeBasedTasks(employeeId, criteria.lateTaskCount, 'after', criteria.timeAfter, session);

            case ACHIEVEMENTS[5].id:
                return await checkConsecutiveAccuracy(employeeId, criteria.accuracyRate, criteria.consecutiveTasks, session);

            case ACHIEVEMENTS[6].id:
                return await checkPeriodAccuracy(employeeId, criteria.accuracyRate, criteria.period, session);

            case ACHIEVEMENTS[7].id:
                return await checkErrorFree(employeeId, criteria.period, session);

            case ACHIEVEMENTS[8].id:
                return await checkPerfectTasks(employeeId, criteria.perfectTasks, session);

            case ACHIEVEMENTS[9].id:
                return await checkSLACompliance(employeeId, criteria.slaCompliance, criteria.period, session);

            case ACHIEVEMENTS[10].id:
                return await checkEarlySubmissions(employeeId, criteria.earlySubmissions, session);

            case ACHIEVEMENTS[11].id:
                return await checkTimeEfficiency(employeeId, criteria.timeEfficiencyTasks, criteria.timeEfficiency, session);

            case ACHIEVEMENTS[12].id:
                return await checkOnTimeTasks(employeeId, criteria.onTimeTasks, session);

            case ACHIEVEMENTS[13].id:
            case ACHIEVEMENTS[14].id:
            case ACHIEVEMENTS[15].id:
            case ACHIEVEMENTS[16].id:
            case ACHIEVEMENTS[17].id:
            case ACHIEVEMENTS[18].id:
                return await checkTotalTasks(employeeId, criteria.totalTasks, session);

            default:
                return false;
        }

    } catch (error) {
        console.error(`Failed to check criteria for ${achievement.id}:`, error);
        return false;
    }
};

// =========================================================================
// Achievement Check Functions
// =========================================================================

const checkTaskCount = async (employeeId, targetCount, period, session) => {
    const dateRange = getDateRange(period);
    const count = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.completedAt': { $gte: dateRange.start, $lte: dateRange.end }
    }).session(session);
    return count >= targetCount;
};

const checkTimeBasedTasks = async (employeeId, targetCount, timeComparison, timeString, session) => {
    const tasks = await ClaimTask.find({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.completedAt': { $exists: true }
    }).session(session);

    const timeBasedTasks = tasks.filter(task => {
        const completedAt = new Date(task.timeTracking.completedAt);
        const taskTime = completedAt.getHours() * 100 + completedAt.getMinutes();
        const targetTime = parseInt(timeString.replace(':', ''));

        return timeComparison === 'before' ? taskTime < targetTime : taskTime > targetTime;
    });

    return timeBasedTasks.length >= targetCount;
};

const checkTotalTasks = async (employeeId, targetCount, session) => {
    const count = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed'
    }).session(session);
    return count >= targetCount;
};

const checkConsecutiveDays = async (employeeId, targetDays, session) => {
    // Get the gamification record for the employee
    const gamification = await Gamification.findOne({ employeeRef: employeeId }).session(session);
    if (!gamification) return false;

    // Use the dailyTask streak for consecutive days
    const currentStreak = gamification.streaks?.dailyTask?.current || 0;
    return currentStreak >= targetDays;
};

const checkConsecutiveAccuracy = async (employeeId, targetAccuracy, taskCount, session) => {
    const recentTasks = await ClaimTask.find({
        assignedTo: employeeId,
        status: 'Completed'
    })
        .populate('qaAuditRef', 'scoringInfo.isPassed')
        .sort({ 'timeTracking.completedAt': -1 })
        .limit(taskCount)
        .session(session);

    if (recentTasks.length < taskCount) return false;

    const accurateTasks = recentTasks.filter(task =>
        task.qaAuditRef?.scoringInfo?.isPassed === true
    ).length;

    const accuracy = (accurateTasks / taskCount) * 100;
    return accuracy >= targetAccuracy;
};

const checkPeriodAccuracy = async (employeeId, targetAccuracy, period, session) => {
    const dateRange = getDateRange(period);
    const tasks = await ClaimTask.find({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.completedAt': { $gte: dateRange.start, $lte: dateRange.end }
    }).session(session);

    if (tasks.length === 0) return false;

    const accurateTasks = tasks.filter(task =>
        !task.qualityAssurance?.hasErrors
    ).length;

    const accuracy = (accurateTasks / tasks.length) * 100;
    return accuracy >= targetAccuracy;
};

const checkErrorFree = async (employeeId, period, session) => {
    const dateRange = getDateRange(period);
    const errorCount = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.completedAt': { $gte: dateRange.start, $lte: dateRange.end },
        'qualityAssurance.hasErrors': true
    }).session(session);
    return errorCount === 0;
};

const checkPerfectTasks = async (employeeId, targetCount, session) => {
    const perfectTasks = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed',
        'qualityAssurance.hasErrors': false,
        'qualityAssurance.qualityScore': { $gte: 100 }
    }).session(session);
    return perfectTasks >= targetCount;
};

const checkSLACompliance = async (employeeId, targetCompliance, period, session) => {
    const dateRange = getDateRange(period);
    const tasks = await ClaimTask.find({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.completedAt': { $gte: dateRange.start, $lte: dateRange.end }
    }).populate('slaTrackingRef', 'timerInfo.dueDateTime').session(session);

    if (tasks.length === 0) return false;

    const onTimeTasks = tasks.filter(task =>
        task.timeTracking.completedAt <= task.slaTrackingRef?.timerInfo?.dueDateTime
    ).length;

    const compliance = (onTimeTasks / tasks.length) * 100;
    return compliance >= targetCompliance;
};

const checkEarlySubmissions = async (employeeId, targetCount, session) => {
    const earlySubmissions = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed',
        $expr: {
            $lt: ['$timeTracking.completedAt', '$dueDate']
        }
    }).session(session);
    return earlySubmissions >= targetCount;
};

const checkTimeEfficiency = async (employeeId, targetTasks, efficiencyPercentage, session) => {
    const tasks = await ClaimTask.find({
        assignedTo: employeeId,
        status: 'Completed',
        'timeTracking.totalTime': { $exists: true },
        'estimatedTime': { $exists: true }
    }).limit(targetTasks).session(session);

    if (tasks.length < targetTasks) return false;

    const efficientTasks = tasks.filter(task => {
        const actualTime = task.timeTracking.totalTime;
        const estimatedTime = task.estimatedTime;
        const efficiency = (estimatedTime / actualTime) * 100;
        return efficiency >= efficiencyPercentage;
    });

    return efficientTasks.length >= targetTasks;
};

const checkOnTimeTasks = async (employeeId, targetCount, session) => {
    const onTimeTasks = await ClaimTask.countDocuments({
        assignedTo: employeeId,
        status: 'Completed',
        $expr: {
            $lte: ['$timeTracking.completedAt', '$dueDate']
        }
    }).session(session);
    return onTimeTasks >= targetCount;
};

// Get Leaderboard
export const getLeaderboard = async (companyId, type = LEADERBOARD_TYPES.POINTS, period = LEADERBOARD_PERIODS.CURRENT_MONTH, limit = 10) => {
    try {
        const pipeline = [
            { $match: { companyRef: companyId } },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeRef',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $match: {
                    'employee.status.employeeStatus': 'Active'
                }
            }
        ];

        // Add period filtering if needed
        if (period !== LEADERBOARD_PERIODS.ALL_TIME) {
            const dateRange = getDateRange(period);
            // Add period-specific matching logic here
        }

        // Add sorting based on type
        switch (type) {
            case LEADERBOARD_TYPES.POINTS:
                if (period === LEADERBOARD_PERIODS.CURRENT_MONTH) {
                    pipeline.push({ $sort: { 'points.currentMonthPoints': -1 } });
                } else if (period === LEADERBOARD_PERIODS.CURRENT_WEEK) {
                    pipeline.push({ $sort: { 'points.currentWeekPoints': -1 } });
                } else {
                    pipeline.push({ $sort: { 'points.totalPoints': -1 } });
                }
                break;
            case LEADERBOARD_TYPES.LEVEL:
                pipeline.push({ $sort: { 'level.currentLevel': -1, 'points.totalPoints': -1 } });
                break;
            case LEADERBOARD_TYPES.ACHIEVEMENTS:
                pipeline.push({
                    $addFields: {
                        achievementCount: { $size: '$achievements.unlockedAchievements' }
                    }
                });
                pipeline.push({ $sort: { achievementCount: -1 } });
                break;
            case LEADERBOARD_TYPES.STREAK:
                pipeline.push({ $sort: { 'streaks.dailyTask.current': -1 } });
                break;
        }

        pipeline.push({ $limit: limit });

        const results = await Gamification.aggregate(pipeline);

        // Format results
        const leaderboard = results.map((item, index) => {
            const levelInfo = calculateLevel(item.points.totalPoints);

            return {
                rank: index + 1,
                employee: {
                    id: item.employeeRef,
                    name: `${item.employee.personalInfo.firstName} ${item.employee.personalInfo.lastName}`,
                    employeeCode: item.employee.employmentInfo.employeeCode,
                    avatar: item.employee.personalInfo.profileImage
                },
                points: {
                    total: item.points.totalPoints,
                    currentMonth: item.points.currentMonthPoints,
                    currentWeek: item.points.currentWeekPoints || 0
                },
                level: levelInfo,
                achievements: item.achievements.unlockedAchievements.length,
                streaks: item.streaks,
                lastActivity: item.statistics?.lastActivity
            };
        });

        return { leaderboard, type, period, totalParticipants: results.length };

    } catch (error) {
        throw new ApiError(500, `Failed to get leaderboard: ${error.message}`);
    }
};

// Get Employee Gamification Stats
export const getEmployeeGamificationStats = async (employeeId) => {
    try {
        const gamification = await Gamification.findOne({ employeeRef: employeeId })
            .populate('employeeRef', 'personalInfo.firstName personalInfo.lastName personalInfo.profileImage');

        if (!gamification) {
            return {
                points: { totalPoints: 0, currentMonthPoints: 0, currentWeekPoints: 0 },
                level: calculateLevel(0),
                achievements: [],
                streaks: {
                    dailyTask: { current: 0, longest: 0 },
                    qualityStreak: { current: 0, longest: 0 },
                    slaStreak: { current: 0, longest: 0 }
                },
                recentActivity: [],
                statistics: {
                    totalTasksCompleted: 0,
                    averageTaskTime: 0,
                    qualityScore: 0,
                    slaCompliance: 0
                }
            };
        }

        const levelInfo = calculateLevel(gamification.points.totalPoints);

        // Get recent point history
        const recentActivity = gamification.points.pointsHistory
            .slice(-10)
            .reverse();

        // Get achievement details with rarity information
        const achievements = gamification.achievements.unlockedAchievements.map(achievement => {
            const achievementInfo = Object.values(ACHIEVEMENTS).find(a => a.id === achievement.achievementId);
            return {
                ...achievement,
                ...achievementInfo,
                rarityInfo: ACHIEVEMENT_RARITY[achievementInfo?.rarity?.toUpperCase()] || ACHIEVEMENT_RARITY.COMMON
            };
        });

        // Calculate achievement statistics by category
        const achievementStats = {
            total: achievements.length,
            byCategory: {},
            byRarity: {},
            completionPercentage: Math.round((achievements.length / Object.keys(ACHIEVEMENTS).length) * 100)
        };

        // Group achievements by category and rarity
        achievements.forEach(achievement => {
            if (achievement.category) {
                achievementStats.byCategory[achievement.category] = (achievementStats.byCategory[achievement.category] || 0) + 1;
            }
            if (achievement.rarity) {
                achievementStats.byRarity[achievement.rarity] = (achievementStats.byRarity[achievement.rarity] || 0) + 1;
            }
        });

        return {
            points: gamification.points,
            level: levelInfo,
            achievements,
            achievementStats,
            streaks: gamification.streaks,
            recentActivity,
            statistics: gamification.statistics || {},
            totalAchievements: Object.keys(ACHIEVEMENTS).length,
            nextLevelInfo: levelInfo.level < 10 ? LEVEL_SYSTEM[levelInfo.level + 1] : null
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get employee gamification stats: ${error.message}`);
    }
};

// Update Streaks
export const updateStreaks = async (employeeId, session) => {
    try {
        const gamification = await Gamification.findOne({ employeeRef: employeeId }).session(session);
        if (!gamification) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check daily task streak
        const tasksToday = await ClaimTask.countDocuments({
            assignedTo: employeeId,
            status: 'Completed',
            'timeTracking.completedAt': { $gte: today, $lt: tomorrow }
        }).session(session);

        if (tasksToday > 0) {
            await updateSpecificStreak(gamification, 'dailyTask', today);
        }

        // Check quality streak
        const qualityTasksToday = await ClaimTask.countDocuments({
            assignedTo: employeeId,
            status: 'Completed',
            'timeTracking.completedAt': { $gte: today, $lt: tomorrow },
            'qualityAssurance.hasErrors': false
        });

        if (qualityTasksToday > 0 && tasksToday === qualityTasksToday) {
            await updateSpecificStreak(gamification, 'qualityStreak', today);
        }

        // Check SLA streak
        const slaCompliantTasksToday = await ClaimTask.countDocuments({
            assignedTo: employeeId,
            status: 'Completed',
            'timeTracking.completedAt': { $gte: today, $lt: tomorrow },
            $expr: { $lte: ['$timeTracking.completedAt', '$dueDate'] }
        }).session(session);

        if (slaCompliantTasksToday > 0 && tasksToday === slaCompliantTasksToday) {
            await updateSpecificStreak(gamification, 'slaStreak', today);
        }

        await gamification.save();

    } catch (error) {
        console.error('Failed to update streaks:', error);
    }
};

const updateSpecificStreak = async (gamification, streakType, today) => {
    const streak = gamification.streaks[streakType];
    const lastUpdate = new Date(streak.lastUpdate);
    lastUpdate.setHours(0, 0, 0, 0);

    const daysDiff = (today - lastUpdate) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
        // Continue streak
        streak.current += 1;
    } else if (daysDiff === 0) {
        // Same day, no change
        return;
    } else {
        // Reset streak
        streak.current = 1;
    }

    // Update longest streak
    if (streak.current > streak.longest) {
        streak.longest = streak.current;
    }

    streak.lastUpdate = new Date();
};

// Utility Functions
const getDailyPoints = (gamification, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return gamification.points.pointsHistory
        .filter(entry => entry.earnedAt >= startOfDay && entry.earnedAt <= endOfDay)
        .reduce((total, entry) => total + entry.points, 0);
};

const getPointCategory = (reason) => {
    if (reason.includes('Achievement')) return 'achievement';
    if (reason.includes('Task')) return 'task';
    if (reason.includes('Bonus')) return 'bonus';
    if (reason.includes('Streak')) return 'streak';
    return 'other';
};

// Award Task Completion Points
export const awardTaskCompletionPoints = async (employeeId, taskId, priority = 'MEDIUM_PRIORITY', isEarly = false, isPerfect = false) => {
    try {
        let totalPoints = 0;
        let reasons = [];

        // Base points for task completion
        const basePoints = POINT_VALUES.TASK_COMPLETION[priority] || POINT_VALUES.TASK_COMPLETION.MEDIUM_PRIORITY;
        totalPoints += basePoints;
        reasons.push(`Task completion (${priority.toLowerCase().replace('_', ' ')})`);

        // Early completion bonus
        if (isEarly) {
            totalPoints += POINT_VALUES.EARLY_COMPLETION;
            reasons.push('Early completion bonus');
        }

        // Perfect quality bonus
        if (isPerfect) {
            totalPoints += POINT_VALUES.PERFECT_QUALITY;
            reasons.push('Perfect quality bonus');
        }

        // Check for weekend work
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        if (isWeekend) {
            totalPoints += POINT_VALUES.WEEKEND_WORK;
            reasons.push('Weekend work bonus');
        }

        // Award the points
        const result = await awardPoints(employeeId, totalPoints, reasons.join(', '), taskId, priority);

        // Update statistics
        await updateEmployeeStatistics(employeeId, taskId);

        return result;

    } catch (error) {
        throw new ApiError(500, `Failed to award task completion points: ${error.message}`);
    }
};

// Update Employee Statistics
const updateEmployeeStatistics = async (employeeId, taskId) => {
    try {
        const gamification = await Gamification.findOne({ employeeRef: employeeId });
        if (!gamification) return;

        const task = await ClaimTask.findById(taskId);
        if (!task) return;

        // Update total tasks completed
        gamification.statistics.totalTasksCompleted += 1;

        // Update average task time
        if (task.timeTracking?.totalTime) {
            const currentAvg = gamification.statistics.averageTaskTime || 0;
            const totalTasks = gamification.statistics.totalTasksCompleted;
            gamification.statistics.averageTaskTime =
                ((currentAvg * (totalTasks - 1)) + task.timeTracking.totalTime) / totalTasks;
        }

        // Update quality score
        const recentTasks = await ClaimTask.find({
            assignedTo: employeeId,
            status: 'Completed'
        }).sort({ 'timeTracking.completedAt': -1 }).limit(20);

        const qualityTasks = recentTasks.filter(t => !t.qualityAssurance?.hasErrors);
        gamification.statistics.qualityScore = (qualityTasks.length / recentTasks.length) * 100;

        // Update SLA compliance
        const onTimeTasks = recentTasks.filter(t =>
            t.timeTracking.completedAt <= t.dueDate
        );
        gamification.statistics.slaCompliance = (onTimeTasks.length / recentTasks.length) * 100;

        // Update last activity
        gamification.statistics.lastActivity = new Date();

        await gamification.save();

    } catch (error) {
        console.error('Failed to update employee statistics:', error);
    }
};

// Award Streak Bonus
export const awardStreakBonus = async (employeeId, streakType, streakCount) => {
    try {
        let points = 0;
        let reason = '';

        switch (streakType) {
            case STREAK_TYPES.DAILY_TASK:
                if (streakCount % 7 === 0) {
                    points = POINT_VALUES.WEEKLY_STREAK_BONUS;
                    reason = `Weekly streak bonus (${streakCount} days)`;
                } else if (streakCount % 30 === 0) {
                    points = POINT_VALUES.MONTHLY_STREAK_BONUS;
                    reason = `Monthly streak bonus (${streakCount} days)`;
                } else {
                    points = POINT_VALUES.DAILY_STREAK_BONUS * streakCount;
                    reason = `Daily streak bonus (${streakCount} days)`;
                }
                break;
            default:
                return null;
        }

        if (points > 0) {
            return await awardPoints(employeeId, points, reason);
        }

        return null;

    } catch (error) {
        throw new ApiError(500, `Failed to award streak bonus: ${error.message}`);
    }
};

// Get Achievement Progress
export const getAchievementProgress = async (employeeId) => {
    try {
        const gamification = await Gamification.findOne({ employeeRef: employeeId });
        if (!gamification) return {};

        const progress = {};

        for (const achievement of Object.values(ACHIEVEMENTS)) {
            if (gamification.achievements.unlockedAchievements.some(a => a.achievementId === achievement.id)) {
                progress[achievement.id] = {
                    completed: true,
                    progress: 100,
                    current: achievement.criteria.taskCount || achievement.criteria.totalTasks || 1,
                    target: achievement.criteria.taskCount || achievement.criteria.totalTasks || 1
                };
            } else {
                const progressData = await calculateAchievementProgress(employeeId, achievement);
                progress[achievement.id] = {
                    completed: false,
                    progress: progressData.percentage,
                    current: progressData.current,
                    target: progressData.target,
                    description: achievement.description
                };
            }
        }

        return progress;

    } catch (error) {
        throw new ApiError(500, `Failed to get achievement progress: ${error.message}`);
    }
};

// Calculate Achievement Progress
const calculateAchievementProgress = async (employeeId, achievement) => {
    try {
        const criteria = achievement.criteria;
        let current = 0;
        let target = 1;

        switch (achievement.id) {
            case 'task_master':
                target = criteria.taskCount;
                current = await ClaimTask.countDocuments({
                    assignedTo: employeeId,
                    status: 'Completed',
                    'timeTracking.completedAt': {
                        $gte: getDateRange(criteria.period).start,
                        $lte: getDateRange(criteria.period).end
                    }
                });
                break;

            case 'speed_demon':
                target = criteria.taskCount;
                const today = getDateRange(TIME_PERIODS.CURRENT_DAY);
                current = await ClaimTask.countDocuments({
                    assignedTo: employeeId,
                    status: 'Completed',
                    'timeTracking.completedAt': { $gte: today.start, $lte: today.end }
                });
                break;

            case 'consistency_king':
                target = criteria.consecutiveDays;
                const gamification = await Gamification.findOne({ employeeRef: employeeId });
                current = gamification?.streaks?.dailyTask?.current || 0;
                break;

            case 'century_club':
            case 'veteran':
            case 'half_k_hero':
            case 'getting_started':
            case 'on_a_roll':
                target = criteria.totalTasks;
                current = await ClaimTask.countDocuments({
                    assignedTo: employeeId,
                    status: 'Completed'
                });
                break;

            case 'deadline_warrior':
                target = criteria.earlySubmissions;
                current = await ClaimTask.countDocuments({
                    assignedTo: employeeId,
                    status: 'Completed',
                    $expr: { $lt: ['$timeTracking.completedAt', '$dueDate'] }
                });
                break;

            default:
                target = 1;
                current = 0;
        }

        const percentage = Math.min(Math.round((current / target) * 100), 100);

        return { current, target, percentage };

    } catch (error) {
        console.error(`Failed to calculate progress for ${achievement.id}:`, error);
        return { current: 0, target: 1, percentage: 0 };
    }
};

// Get Company Gamification Overview
export const getCompanyGamificationOverview = async (companyId) => {
    try {
        const pipeline = [
            { $match: { companyRef: companyId } },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeRef',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $match: {
                    'employee.status.employeeStatus': 'Active'
                }
            },
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: 1 },
                    totalPointsAwarded: { $sum: '$points.totalPoints' },
                    totalAchievementsUnlocked: { $sum: { $size: '$achievements.unlockedAchievements' } },
                    averageLevel: { $avg: '$level.currentLevel' },
                    topPerformer: {
                        $max: {
                            points: '$points.totalPoints',
                            employeeId: '$employeeRef',
                            level: '$level.currentLevel'
                        }
                    },
                    levelDistribution: {
                        $push: '$level.currentLevel'
                    }
                }
            }
        ];

        const result = await Gamification.aggregate(pipeline);
        const overview = result[0] || {};

        // Calculate level distribution
        const levelCounts = {};
        for (let i = 1; i <= 10; i++) {
            levelCounts[i] = 0;
        }

        if (overview.levelDistribution) {
            overview.levelDistribution.forEach(level => {
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            });
        }

        // Get recent achievements (last 7 days)
        const recentAchievements = await Gamification.aggregate([
            { $match: { companyRef: companyId } },
            { $unwind: '$achievements.unlockedAchievements' },
            {
                $match: {
                    'achievements.unlockedAchievements.unlockedAt': {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeRef',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            { $limit: 10 },
            { $sort: { 'achievements.unlockedAchievements.unlockedAt': -1 } }
        ]);

        return {
            totalParticipants: overview.totalParticipants || 0,
            totalPointsAwarded: overview.totalPointsAwarded || 0,
            totalAchievementsUnlocked: overview.totalAchievementsUnlocked || 0,
            averageLevel: Math.round(overview.averageLevel || 1),
            levelDistribution: levelCounts,
            recentAchievements: recentAchievements.map(item => ({
                employeeName: `${item.employee.personalInfo.firstName} ${item.employee.personalInfo.lastName}`,
                achievementId: item.achievements.unlockedAchievements.achievementId,
                achievementName: ACHIEVEMENTS[item.achievements.unlockedAchievements.achievementId.toUpperCase()]?.name || 'Unknown',
                achievementIcon: ACHIEVEMENTS[item.achievements.unlockedAchievements.achievementId.toUpperCase()]?.icon || '🏆',
                unlockedAt: item.achievements.unlockedAchievements.unlockedAt
            })),
            engagementMetrics: {
                activeUsers: overview.totalParticipants || 0,
                avgPointsPerUser: overview.totalParticipants ?
                    Math.round(overview.totalPointsAwarded / overview.totalParticipants) : 0,
                avgAchievementsPerUser: overview.totalParticipants ?
                    Math.round(overview.totalAchievementsUnlocked / overview.totalParticipants) : 0
            }
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get company gamification overview: ${error.message}`);
    }
};

// Reset Monthly Points
export const resetMonthlyPoints = async () => {
    try {
        const result = await Gamification.updateMany(
            {},
            {
                $set: { 'points.currentMonthPoints': 0 },
                $push: {
                    'points.monthlyHistory': {
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear(),
                        points: '$points.currentMonthPoints',
                        resetAt: new Date()
                    }
                }
            }
        );

        console.log(`Reset monthly points for ${result.modifiedCount} employees`);
        return result;

    } catch (error) {
        console.error('Failed to reset monthly points:', error);
        throw new ApiError(500, `Failed to reset monthly points: ${error.message}`);
    }
};

// Reset Weekly Points
export const resetWeeklyPoints = async () => {
    try {
        const result = await Gamification.updateMany(
            {},
            {
                $set: { 'points.currentWeekPoints': 0 },
                $push: {
                    'points.weeklyHistory': {
                        week: getWeekNumber(new Date()),
                        year: new Date().getFullYear(),
                        points: '$points.currentWeekPoints',
                        resetAt: new Date()
                    }
                }
            }
        );

        console.log(`Reset weekly points for ${result.modifiedCount} employees`);
        return result;

    } catch (error) {
        console.error('Failed to reset weekly points:', error);
        throw new ApiError(500, `Failed to reset weekly points: ${error.message}`);
    }
};

// Helper function to get week number
const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Bulk Award Points (for batch operations)
export const bulkAwardPoints = async (awards) => {
    try {
        const results = [];

        for (const award of awards) {
            try {
                const result = await awardPoints(
                    award.employeeId,
                    award.points,
                    award.reason,
                    award.taskId
                );
                results.push({ success: true, employeeId: award.employeeId, result });
            } catch (error) {
                results.push({
                    success: false,
                    employeeId: award.employeeId,
                    error: error.message
                });
            }
        }

        return results;

    } catch (error) {
        throw new ApiError(500, `Failed to bulk award points: ${error.message}`);
    }
};

// Export all functions
export default {
    awardPoints,
    awardTaskCompletionPoints,
    awardStreakBonus,
    calculateLevel,
    checkAchievements,
    updateStreaks,
    getLeaderboard,
    getEmployeeGamificationStats,
    getAchievementProgress,
    getCompanyGamificationOverview,
    resetMonthlyPoints,
    resetWeeklyPoints,
    bulkAwardPoints
};