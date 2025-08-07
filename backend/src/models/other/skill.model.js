// backend/src/models/other/skill.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const skillSchema = new mongoose.Schema({
    skillId: {
        type: String,
        unique: true,
        default: () => `SKILL-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    skillName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    skillCategory: {
        type: String,
        enum: ['Technical', 'Soft', 'Language', 'Software', 'Medical', 'Other'],
        required: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
}, { timestamps: true });

// Ensures a skill name is unique within a single company
skillSchema.index({ companyRef: 1, skillName: 1 }, { unique: true });

export const Skill = mongoose.model("Skill", skillSchema, "skills");