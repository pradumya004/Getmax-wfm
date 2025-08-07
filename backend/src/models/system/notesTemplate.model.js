// backend/src/models/system/notesTemplate.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const fieldSchema = new mongoose.Schema({
    fieldName: { type: String, required: true, trim: true },
    fieldType: {
        type: String,
        enum: ['Text', 'Textarea', 'Dropdown', 'Multi-select', 'Date', 'Number', 'Boolean'],
        required: true
    },
    fieldLabel: { type: String, required: true, trim: true },
    options: [String], // For Dropdown or Multi-select
    isRequired: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 1 }
}, { _id: false });

const notesTemplateSchema = new mongoose.Schema({
    templateId: {
        type: String,
        unique: true,
        default: () => `NTPL-${uuidv4().substring(0, 8).toUpperCase()}`,
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
    noteType: { // Links this template to a specific type of note
        type: String,
        enum: ['Task Note', 'QA Note', 'Follow-up Note', 'Denial Note', 'Appeal Note', 'Call Note'],
        required: true
    },
    fields: [fieldSchema],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

notesTemplateSchema.index({ companyRef: 1, noteType: 1 });

export const NotesTemplate = mongoose.model('NotesTemplate', notesTemplateSchema, 'notestemplates');