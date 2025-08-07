// backend/src/models/performance/achievement.model.js

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    achievementId: { // e.g., 'TASK_MASTER_1'
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String, // e.g., '🏆' or a font-awesome class name
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    rarity: {
        type: String,
        enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
        default: 'Common'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

achievementSchema.index({ companyRef: 1, achievementId: 1 });

export const Achievement = mongoose.model("Achievement", achievementSchema, "achievements");