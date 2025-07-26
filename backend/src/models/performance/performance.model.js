// backend/src/models/performance/performance.model.js

import mongoose from 'mongoose';
import { PERFORMANCE_PERIODS, PERFORMANCE_RATINGS } from '../../../shared/constants/performanceConstants.js';

// Performance Metrics Schema
const performanceMetricsSchema = new mongoose.Schema({
    // --- Core Links & Identifiers ---
    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        index: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true,
    },

    // --- Period Definition ---
    // Stores the time frame this performance record covers.
    period: {
        periodType: { type: String, required: true },
        from: { type: Date, required: true },
        to: { type: Date, required: true },
    },

    // --- Detailed Metric Data ---
    // Stores the full, complex object of calculated metrics.
    // Using Mixed type for flexibility as the structure is complex and varied.
    metrics: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // --- Aggregated Scores ---
    // Stores the final calculated scores for each category and overall.
    scores: {
        overallScore: { type: Number, default: 0, index: true }, // Indexed for leaderboard performance
        productivityScore: { type: Number, default: 0 },
        qualityScore: { type: Number, default: 0 },
        efficiencyScore: { type: Number, default: 0 },
        slaScore: { type: Number, default: 0 },
        volumeScore: { type: Number, default: 0 },
        accuracyScore: { type: Number, default: 0 },
        timelinessScore: { type: Number, default: 0 },
    },

    // --- Descriptive Ratings ---
    // Stores the human-readable ratings based on the scores.
    ratings: {
        overallRating: { type: String, default: 'Not Rated' },
        productivityRating: { type: String, default: 'Not Rated' },
        qualityRating: { type: String, default: 'Not Rated' },
        efficiencyRating: { type: String, default: 'Not Rated' },
        slaRating: { type: String, default: 'Not Rated' },
    },

    // --- Contextual Data ---
    // Stores the targets and weights used for this specific calculation.
    targets: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    weights: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // --- Metadata ---
    calculatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// A compound index to ensure only one performance document exists
// per employee for a specific time period. This is crucial for the
// upsert logic in `calculatePerformanceMetrics`.
performanceSchema.index({ employeeRef: 1, 'period.from': 1, 'period.to': 1 }, { unique: true });

export const Performance = mongoose.model('Performance', performanceSchema, 'performances');