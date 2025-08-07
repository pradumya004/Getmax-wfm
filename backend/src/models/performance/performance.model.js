// backend/src/models/performance/performance.model.js

import mongoose from 'mongoose';
import { PERFORMANCE_PERIODS, PERFORMANCE_RATINGS } from '../../../shared/constants/performanceConstants.js';

// Sub-schema for detailed metrics
const detailedMetricsSubSchema = new mongoose.Schema({
    productivity: {
        tasksCompleted: Number,
        tasksPerDay: Number,
        completionRate: Number,
        score: Number,
        rating: String
    },
    quality: {
        accuracyRate: Number,
        errorRate: Number,
        reworkRate: Number,
        score: Number,
        rating: String
    },
    efficiency: {
        averageCompletionTime: Number,
        onTimeCompletionRate: Number,
        score: Number,
        rating: String
    },
    sla: {
        totalSLAs: Number,
        metSLAs: Number,
        breachedSLAs: Number,
        slaComplianceRate: Number,
        score: Number,
        rating: String
    },
}, { _id: false });

// Sub-schema for targets
const targetsSubSchema = new mongoose.Schema({
    productivity: { tasksPerDay: Number },
    quality: { accuracyRate: Number },
    efficiency: { onTimeCompletionRate: Number },
    sla: { complianceRate: Number }
}, { _id: false });

// Sub-schema for weights
const weightsSubSchema = new mongoose.Schema({
    productivity: Number,
    quality: Number,
    efficiency: Number,
    sla: Number
}, { _id: false });

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
    metrics: {
        type: detailedMetricsSubSchema,
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
        type: targetsSubSchema,
        default: {}
    },
    weights: {
        type: mweightsSubSchema,
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
performanceMetricsSchema.index({ employeeRef: 1, 'period.from': 1, 'period.to': 1 }, { unique: true });

export const Performance = mongoose.model('Performance', performanceMetricsSchema, 'performances');