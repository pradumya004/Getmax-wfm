// backend/src/utils/dateUtils.js

// A centralized utility for handling date calculations across services.
import { TIME_PERIODS } from '../../../shared/constants/performanceConstants.js'; // Using constants for consistency

export const getDateRange = (period) => {
    const now = new Date();
    let start, end;

    switch (period) {
        case TIME_PERIODS.CURRENT_WEEK:
        case 'week': // Adding aliases for gamification service
            start = new Date(now.setDate(now.getDate() - now.getDay()));
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;

        case TIME_PERIODS.CURRENT_MONTH:
        case 'month': // Adding aliases for gamification service
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;

        case TIME_PERIODS.CURRENT_QUARTER:
        case 'quarter': // Adding aliases for gamification service
            const quarter = Math.floor(now.getMonth() / 3);
            start = new Date(now.getFullYear(), quarter * 3, 1);
            end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
            break;

        case TIME_PERIODS.CURRENT_YEAR:
        case 'year': // Adding aliases for gamification service
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;

        case TIME_PERIODS.LAST_30_DAYS:
            end = new Date();
            start = new Date();
            start.setDate(end.getDate() - 30);
            break;

        case TIME_PERIODS.LAST_90_DAYS:
            end = new Date();
            start = new Date();
            start.setDate(end.getDate() - 90);
            break;

        case 'day': // Alias for gamification service
            start = new Date();
            start.setHours(0, 0, 0, 0);
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;

        default:
            // Default to current month if period is unknown
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { start, end };
};