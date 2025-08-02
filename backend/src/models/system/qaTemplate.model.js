// backend/src/models/system/qaTemplate.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const qaCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        enum: ['Data Accuracy', 'Process Compliance', 'Communication Quality', 'Documentation', 'Coding Accuracy', 'Financial Accuracy']
    },
    maxPoints: { type: Number, required: true, min: 1 },
    weightage: { type: Number, default: 10, min: 0, max: 100 }
}, { _id: false });

const qaTemplateSchema = new mongoose.Schema({
    qaTemplateId: {
        type: String,
        unique: true,
        default: () => `QATPL-${uuidv4().substring(0, 8).toUpperCase()}`,
        immutable: true
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    templateName: {
        type: String,
        required: true,
        trim: true
    },
    qaType: { // Links this template to a specific type of QA
        type: String,
        enum: ['Random Sample', 'Targeted Review', 'New Employee', 'Compliance Check'],
        required: true
    },
    categories: [qaCategorySchema],
    passingScore: { type: Number, default: 85, min: 0, max: 100 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

qaTemplateSchema.index({ companyRef: 1, qaType: 1 });

export const QATemplate = mongoose.model('QATemplate', qaTemplateSchema, 'qatemplates');
