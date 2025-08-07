// backend/src/models/system/notes.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const notesSchema = new mongoose.Schema({
    noteId: {
        type: String,
        unique: true,
        default: () => `NOTE-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // GetMax company
        required: [true, 'Company reference is required'],
        index: true
    },
    claimRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClaimTask', // Claim this note is associated with
        required: [true, 'Claim reference is required'],
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client for reporting/filtering
        required: [true, 'Client reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW', // SOW for note template/structure
        required: [true, 'SOW reference is required'],
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Employee who created the note
        required: [true, 'Created by reference is required'],
        index: true
    },

    // ** NOTE BASIC INFORMATION **
    noteInfo: {
        noteType: {
            type: String,
            enum: [
                'Task Note', 'QA Note', 'Follow-up Note', 'Payment Note',
                'Denial Note', 'Appeal Note', 'Call Note', 'Email Note',
                'System Note', 'Escalation Note', 'Resolution Note',
                'Authorization Note', 'Claim Review Note', 'Provider Note'
            ],
            required: [true, 'Note type is required'],
            index: true,
            validate: {
                validator: function (v) {
                    // Business logic: System notes can only be created by system
                    if (v === 'System Note' && !this.noteInfo?.isSystemGenerated) {
                        return false;
                    }
                    return true;
                },
                message: 'System notes can only be created by system processes'
            }
        },
        noteSubType: {
            type: String,
            trim: true,
            maxlength: [50, 'Note sub-type cannot exceed 50 characters'],
            validate: {
                validator: function (v) {
                    // Require sub-type for certain note types
                    const requiresSubType = ['Call Note', 'Email Note', 'Denial Note', 'Appeal Note'];
                    if (requiresSubType.includes(this.noteInfo?.noteType) && !v) {
                        return false;
                    }
                    return true;
                },
                message: 'Sub-type is required for this note type'
            }
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
            default: 'Normal',
            index: true
        },
        isSystemGenerated: {
            type: Boolean,
            default: false,
            index: true
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        isClientVisible: {
            type: Boolean,
            default: true,
            required: [true, 'Client visibility flag is required'],
            validate: {
                validator: function (v) {
                    // Private notes cannot be client visible
                    if (this.noteInfo?.isPrivate && v) {
                        return false;
                    }
                    return true;
                },
                message: 'Private notes cannot be client visible'
            }
        }
    },

    // ** STRUCTURED NOTE CONTENT **
    structuredContent: {
        // Template-based structured fields
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NotesTemplate'
        },
        templateVersion: {
            type: String,
            default: '1.0'
        },
        structuredFields: [{
            fieldName: {
                type: String,
                required: true,
                trim: true
            },
            fieldType: {
                type: String,
                enum: ['Text', 'Textarea', 'Dropdown', 'Multi-select', 'Date', 'Number', 'Boolean', 'File'],
                required: true
            },
            fieldLabel: {
                type: String,
                required: true,
                trim: true
            },
            fieldValue: {
                type: mongoose.Schema.Types.Mixed, // Can store any data type
                required: true
            },
            isRequired: {
                type: Boolean,
                default: false
            },
            displayOrder: {
                type: Number,
                default: 1
            }
        }],
        // Free-form note content
        freeFormNote: {
            type: String,
            trim: true,
            maxlength: [5000, 'Free form note cannot exceed 5000 characters']
        },
        // Quick summary/preview
        summary: {
            type: String,
            trim: true,
            maxlength: [200, 'Summary cannot exceed 200 characters']
        }
    },

    // ** COMMUNICATION DETAILS **
    communicationInfo: {
        // For call notes
        callDetails: {
            phoneNumber: {
                type: String,
                trim: true
            },
            callDirection: {
                type: String,
                enum: ['Inbound', 'Outbound'],
                default: 'Outbound'
            },
            callDuration: {
                type: Number, // in minutes
                min: [0, 'Call duration cannot be negative']
            },
            callResult: {
                type: String,
                enum: [
                    'Answered', 'No Answer', 'Busy', 'Voicemail Left',
                    'Wrong Number', 'Disconnected', 'Call Back Requested'
                ]
            },
            callQuality: {
                type: String,
                enum: ['Excellent', 'Good', 'Fair', 'Poor'],
                default: 'Good'
            },
            recordingAvailable: {
                type: Boolean,
                default: false
            },
            recordingId: String,
            transferredTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
        },
        // For email notes
        emailDetails: {
            emailSubject: {
                type: String,
                trim: true,
                maxlength: [200, 'Email subject cannot exceed 200 characters']
            },
            emailDirection: {
                type: String,
                enum: ['Inbound', 'Outbound'],
                default: 'Outbound'
            },
            recipientEmails: [{
                type: String,
                validate: {
                    validator: function (v) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            }],
            senderEmail: {
                type: String,
                validate: {
                    validator: function (v) {
                        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                    },
                    message: 'Invalid sender email format'
                }
            },
            emailDeliveryStatus: {
                type: String,
                enum: ['Sent', 'Delivered', 'Bounced', 'Failed', 'Pending'],
                default: 'Pending'
            },
            hasAttachments: {
                type: Boolean,
                default: false
            },
            attachmentCount: {
                type: Number,
                min: [0, 'Attachment count cannot be negative'],
                default: 0
            },
            emailSentDate: Date,
            emailReceivedDate: Date
        }
    },

    // ** ACTION ITEMS & FOLLOW-UP **
    actionItems: {
        hasActionItems: {
            type: Boolean,
            default: false,
            index: true
        },
        actionItemsList: [{
            actionId: {
                type: String,
                default: () => `ACT-${uuidv4().substring(0, 8).toUpperCase()}`,
                unique: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            dueDate: {
                type: Date,
                index: true
            },
            priority: {
                type: String,
                enum: ['Low', 'Normal', 'High', 'Critical', 'Emergency'],
                default: 'Normal'
            },
            status: {
                type: String,
                enum: ['Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold'],
                default: 'Pending'
            },
            completedDate: Date,
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            estimatedEffort: {
                type: Number, // in hours
                min: [0.1, 'Estimated effort must be at least 0.1 hours'],
                max: [80, 'Estimated effort cannot exceed 80 hours']
            },
            actualEffort: {
                type: Number, // in hours
                min: [0, 'Actual effort cannot be negative']
            },
            notes: {
                type: String,
                trim: true,
                maxlength: [1000, 'Action item notes cannot exceed 1000 characters']
            },
            escalationLevel: {
                type: Number,
                min: [0, 'Escalation level cannot be negative'],
                max: [5, 'Escalation level cannot exceed 5'],
                default: 0
            }
        }],
        followUpRequired: {
            type: Boolean,
            default: false,
            index: true
        },
        followUpDate: {
            type: Date,
            index: true
        },
        followUpType: {
            type: String,
            enum: ['Phone Call', 'Email', 'Letter', 'Portal Check', 'Internal Review'],
            default: 'Phone Call'
        },
        followUpAssignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        followUpCompleted: {
            type: Boolean,
            default: false
        },
        followUpCompletedDate: Date,
        followUpNotes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Follow-up notes cannot exceed 1000 characters']
        }
    },

    // ** STATUS & WORKFLOW IMPACT **
    workflowImpact: {
        triggersStatusChange: {
            type: Boolean,
            default: false
        },
        newStatus: {
            type: String,
            enum: [
                'New', 'Assigned', 'In Progress', 'Pending Info', 'On Hold',
                'Pending Payment', 'Appealed', 'Denied', 'Completed',
                'QA Review', 'QA Failed', 'Closed'
            ]
        },
        reasonForStatusChange: {
            type: String,
            trim: true
        },
        impactsPayment: {
            type: Boolean,
            default: false
        },
        impactsSLA: {
            type: Boolean,
            default: false
        },
        slaAction: {
            type: String,
            enum: ['Pause', 'Resume', 'Reset', 'No Change'],
            default: 'No Change'
        },
        escalationTriggered: {
            type: Boolean,
            default: false
        },
        escalationReason: {
            type: String,
            trim: true
        }
    },

    // ** OUTCOME & RESOLUTION **
    outcomeInfo: {
        hasOutcome: {
            type: Boolean,
            default: false
        },
        outcomeType: {
            type: String,
            enum: [
                'Information Received', 'Payment Expected', 'Denial Received',
                'Appeal Required', 'Write-off Recommended', 'Additional Info Needed',
                'Claim Resolved', 'Escalation Required', 'No Resolution'
            ]
        },
        outcomeDescription: {
            type: String,
            trim: true
        },
        nextSteps: {
            type: String,
            trim: true
        },
        expectedResolutionDate: Date,
        actualResolutionDate: Date,
        resolutionAmount: {
            type: Number,
            min: [0, 'Resolution amount cannot be negative']
        }
    },

    // ** CATEGORIES & TAGS **
    categorization: {
        primaryCategory: {
            type: String,
            enum: [
                'Payment Follow-up', 'Denial Management', 'Prior Authorization',
                'Eligibility Verification', 'Appeal Process', 'Information Request',
                'Provider Contact', 'Patient Contact', 'Internal Review',
                'Quality Assurance', 'System Issue', 'Other'
            ],
            required: [true, 'Primary category is required'],
            index: true
        },
        secondaryCategory: {
            type: String,
            trim: true
        },
        tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        customClassifications: [{
            classificationName: {
                type: String,
                required: true,
                trim: true
            },
            classificationValue: {
                type: String,
                required: true,
                trim: true
            }
        }],
        businessProcess: {
            type: String,
            enum: [
                'Claims Processing', 'Prior Authorization', 'Appeals Management',
                'Payment Posting', 'Denial Management', 'Quality Assurance',
                'Customer Service', 'Provider Enrollment', 'Compliance Review'
            ],
            index: true
        }
    },

    // ** ATTACHMENTS & REFERENCES **
    attachments: {
        attachmentsList: [{
            fileName: {
                type: String,
                required: true,
                trim: true
            },
            fileType: {
                type: String,
                enum: ['PDF', 'Image', 'Document', 'Spreadsheet', 'Other'],
                required: true
            },
            fileSize: {
                type: Number, // in bytes
                min: [0, 'File size cannot be negative']
            },
            filePath: {
                type: String,
                required: true,
                trim: true
            },
            uploadedDate: {
                type: Date,
                default: Date.now
            },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            description: {
                type: String,
                trim: true
            }
        }],
        relatedDocuments: [{
            documentType: {
                type: String,
                enum: ['EOB', 'ERA', 'Denial Letter', 'Appeal Letter', 'Authorization', 'Other']
            },
            documentNumber: String,
            documentDate: Date,
            documentDescription: String
        }]
    },

    // ** VERSION CONTROL **
    versionInfo: {
        version: {
            type: Number,
            default: 1,
            min: [1, 'Version must be at least 1']
        },
        isLatestVersion: {
            type: Boolean,
            default: true,
            index: true
        },
        parentNoteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notes'
        },
        editHistory: [{
            editedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            editedAt: {
                type: Date,
                default: Date.now
            },
            editReason: {
                type: String,
                trim: true
            },
            changesDescription: {
                type: String,
                trim: true
            }
        }]
    },

    // ** APPROVAL WORKFLOW **
    approvalInfo: {
        requiresApproval: {
            type: Boolean,
            default: false
        },
        approvalStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Not Required'],
            default: 'Not Required',
            index: true
        },
        approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedDate: Date,
        approvalNotes: {
            type: String,
            trim: true
        },
        rejectionReason: {
            type: String,
            trim: true
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        deletedAt: Date,
        deletionReason: {
            type: String,
            trim: true
        },
        isConfidential: {
            type: Boolean,
            default: false
        },
        accessLevel: {
            type: String,
            enum: ['Public', 'Internal', 'Restricted', 'Confidential'],
            default: 'Internal'
        },
        lastViewedDate: Date,
        viewCount: {
            type: Number,
            default: 0,
            min: [0, 'View count cannot be negative']
        },
        processingStatus: {
            type: String,
            enum: ['Draft', 'Pending Review', 'Under Review', 'Approved', 'Published', 'Archived'],
            default: 'Draft',
            index: true
        },
        qualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100'],
            default: null
        },
        completenessScore: {
            type: Number,
            min: [0, 'Completeness score cannot be negative'],
            max: [100, 'Completeness score cannot exceed 100'],
            default: null
        },
        wordCount: {
            type: Number,
            default: 0,
            min: [0, 'Word count cannot be negative']
        },
        characterCount: {
            type: Number,
            default: 0,
            min: [0, 'Character count cannot be negative']
        }
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        lastAccessedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastAccessedAt: Date,
        accessHistory: [{
            accessedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            accessedAt: {
                type: Date,
                default: Date.now
            },
            accessType: {
                type: String,
                enum: ['View', 'Edit', 'Delete', 'Export', 'Print'],
                required: true
            },
            ipAddress: String,
            userAgent: String
        }],
        complianceInfo: {
            isHIPAACompliant: {
                type: Boolean,
                default: true
            },
            dataClassification: {
                type: String,
                enum: ['Public', 'Internal', 'Confidential', 'Restricted'],
                default: 'Internal'
            },
            retentionPeriod: {
                type: Number, // in days
                default: 2555, // 7 years
                min: [365, 'Retention period must be at least 1 year']
            },
            retentionExpiryDate: {
                type: Date,
                default: function () {
                    return new Date(Date.now() + (this.auditInfo?.complianceInfo?.retentionPeriod || 2555) * 24 * 60 * 60 * 1000);
                }
            }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
notesSchema.index({ companyRef: 1, claimRef: 1, 'noteInfo.noteType': 1 });
notesSchema.index({ createdBy: 1, createdAt: -1 });
notesSchema.index({ sowRef: 1, 'categorization.primaryCategory': 1 });
notesSchema.index({ 'actionItems.hasActionItems': 1, 'actionItems.followUpRequired': 1 });
notesSchema.index({ 'approvalInfo.approvalStatus': 1 });

// Compound indexes for complex queries
notesSchema.index({
    claimRef: 1,
    'versionInfo.isLatestVersion': 1,
    'systemInfo.isActive': 1
});

notesSchema.index({
    companyRef: 1,
    'noteInfo.noteType': 1,
    createdAt: -1
});

notesSchema.index({
    'actionItems.actionItemsList.assignedTo': 1,
    'actionItems.actionItemsList.status': 1
});

// ** VIRTUAL FIELDS **
notesSchema.virtual('isOverdue').get(function () {
    if (!this.actionItems.followUpRequired || !this.actionItems.followUpDate) {
        return false;
    }
    return new Date() > this.actionItems.followUpDate && !this.actionItems.followUpCompleted;
});

notesSchema.virtual('wordCount').get(function () {
    const freeFormWords = this.structuredContent.freeFormNote ?
        this.structuredContent.freeFormNote.split(/\s+/).length : 0;

    const structuredWords = this.structuredContent.structuredFields.reduce((count, field) => {
        if (typeof field.fieldValue === 'string') {
            return count + field.fieldValue.split(/\s+/).length;
        }
        return count;
    }, 0);

    return freeFormWords + structuredWords;
});

notesSchema.virtual('hasOutstandingActions').get(function () {
    return this.actionItems.actionItemsList.some(
        action => action.status === 'Pending' || action.status === 'In Progress'
    );
});

notesSchema.virtual('claim', {
    ref: 'ClaimTask',
    localField: 'claimRef',
    foreignField: '_id',
    justOne: true
});

notesSchema.virtual('author', {
    ref: 'Employee',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

// ** STATIC METHODS **
notesSchema.statics.findByClaimId = function (claimRef, latestOnly = true) {
    const query = {
        claimRef,
        'systemInfo.isActive': true,
        'systemInfo.isDeleted': false
    };

    if (latestOnly) {
        query['versionInfo.isLatestVersion'] = true;
    }

    return this.find(query)
        .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 });
};

notesSchema.statics.findByNoteType = function (companyRef, noteType, limit = 50) {
    return this.find({
        companyRef,
        'noteInfo.noteType': noteType,
        'systemInfo.isActive': true,
        'systemInfo.isDeleted': false,
        'versionInfo.isLatestVersion': true
    })
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 })
        .limit(limit);
};

notesSchema.statics.findActionItemsDue = function (companyRef, assignedTo = null) {
    const query = {
        companyRef,
        'actionItems.hasActionItems': true,
        'actionItems.followUpRequired': true,
        'actionItems.followUpCompleted': false,
        'actionItems.followUpDate': { $lte: new Date() },
        'systemInfo.isActive': true
    };

    if (assignedTo) {
        query['actionItems.followUpAssignedTo'] = assignedTo;
    }

    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .populate('actionItems.followUpAssignedTo', 'personalInfo.firstName personalInfo.lastName')
        .sort({ 'actionItems.followUpDate': 1 });
};

notesSchema.statics.findPendingApproval = function (companyRef, approver = null) {
    const query = {
        companyRef,
        'approvalInfo.approvalStatus': 'Pending',
        'systemInfo.isActive': true
    };

    if (approver) {
        query['approvalInfo.approver'] = approver;
    }

    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: 1 });
};

notesSchema.statics.findByCategory = function (companyRef, category, fromDate = null, toDate = null) {
    const query = {
        companyRef,
        'categorization.primaryCategory': category,
        'systemInfo.isActive': true,
        'versionInfo.isLatestVersion': true
    };

    if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    return this.find(query)
        .populate('claimRef', 'claimId financialInfo.outstandingBalance')
        .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 });
};

// ** INSTANCE METHODS **
notesSchema.methods.addActionItem = function (description, assignedTo, dueDate, priority = 'Normal') {
    this.actionItems.hasActionItems = true;
    this.actionItems.actionItemsList.push({
        description,
        assignedTo,
        dueDate,
        priority,
        status: 'Pending'
    });

    // Set follow-up if not already set
    if (!this.actionItems.followUpRequired && dueDate) {
        this.actionItems.followUpRequired = true;
        this.actionItems.followUpDate = dueDate;
        this.actionItems.followUpAssignedTo = assignedTo;
    }
};

notesSchema.methods.completeActionItem = function (actionItemId, completedBy, notes = '') {
    const actionItem = this.actionItems.actionItemsList.id(actionItemId);
    if (actionItem) {
        actionItem.status = 'Completed';
        actionItem.completedDate = new Date();
        actionItem.completedBy = completedBy;
        actionItem.notes = notes;

        // Check if all action items are completed
        const allCompleted = this.actionItems.actionItemsList.every(
            item => item.status === 'Completed' || item.status === 'Cancelled'
        );

        if (allCompleted) {
            this.actionItems.followUpCompleted = true;
            this.actionItems.followUpCompletedDate = new Date();
        }
    }
};

notesSchema.methods.requestApproval = function (approver, reason = '') {
    this.approvalInfo.requiresApproval = true;
    this.approvalInfo.approvalStatus = 'Pending';
    this.approvalInfo.approver = approver;
    this.approvalInfo.approvalNotes = reason;
};

notesSchema.methods.approve = function (approver, notes = '') {
    this.approvalInfo.approvalStatus = 'Approved';
    this.approvalInfo.approver = approver;
    this.approvalInfo.approvedDate = new Date();
    this.approvalInfo.approvalNotes = notes;
};

notesSchema.methods.reject = function (approver, reason) {
    this.approvalInfo.approvalStatus = 'Rejected';
    this.approvalInfo.approver = approver;
    this.approvalInfo.rejectionReason = reason;
    this.approvalInfo.approvedDate = new Date();
};

notesSchema.methods.createRevision = function (revisedBy, reason, changes) {
    // Mark current version as not latest
    this.versionInfo.isLatestVersion = false;

    // Add to edit history
    this.versionInfo.editHistory.push({
        editedBy: revisedBy,
        editReason: reason,
        changesDescription: changes
    });

    // Create new version
    const newNote = this.toObject();
    delete newNote._id;
    delete newNote.noteId;

    newNote.versionInfo.version += 1;
    newNote.versionInfo.isLatestVersion = true;
    newNote.versionInfo.parentNoteId = this._id;
    newNote.auditInfo.lastModifiedBy = revisedBy;
    newNote.auditInfo.lastModifiedAt = new Date();

    return new this.constructor(newNote);
};

notesSchema.methods.softDelete = function (deletedBy, reason) {
    this.systemInfo.isDeleted = true;
    this.systemInfo.isActive = false;
    this.systemInfo.deletedBy = deletedBy;
    this.systemInfo.deletedAt = new Date();
    this.systemInfo.deletionReason = reason;
};

// ** PRE-SAVE MIDDLEWARE **
notesSchema.pre('save', function (next) {
    try {
        // Calculate word and character counts
        let totalText = this.structuredContent?.freeFormNote || '';

        if (this.structuredContent?.structuredFields) {
            totalText += ' ' + this.structuredContent.structuredFields
                .map(field => typeof field.fieldValue === 'string' ? field.fieldValue : '')
                .join(' ');
        }

        this.systemInfo.wordCount = totalText.trim().split(/\s+/).filter(word => word.length > 0).length;
        this.systemInfo.characterCount = totalText.length;

        // Calculate completion percentage
        let completionScore = 0;
        let totalFields = 0;

        // Required fields scoring
        const requiredChecks = [
            () => !!this.noteInfo?.noteType,
            () => !!this.noteInfo?.priority,
            () => !!this.structuredContent?.summary,
            () => !!this.categorization?.primaryCategory,
            () => this.structuredContent?.freeFormNote?.length > 10 ||
                (this.structuredContent?.structuredFields?.length || 0) > 0
        ];

        totalFields = requiredChecks.length;
        completionScore = requiredChecks.filter(check => check()).length;

        // Structured fields completion
        if (this.structuredContent?.structuredFields?.length > 0) {
            const requiredFields = this.structuredContent.structuredFields.filter(f => f.isRequired);
            const completedRequired = requiredFields.filter(f =>
                f.fieldValue !== null && f.fieldValue !== undefined && f.fieldValue !== ''
            );

            if (requiredFields.length > 0) {
                totalFields += requiredFields.length;
                completionScore += completedRequired.length;
            }
        }

        this.structuredContent.completionPercentage = totalFields > 0 ?
            Math.round((completionScore / totalFields) * 100) : 0;
        this.structuredContent.isComplete = this.structuredContent.completionPercentage >= 80;

        // Auto-generate summary if not provided
        if (!this.structuredContent?.summary && totalText.length > 0) {
            this.structuredContent.summary = totalText.substring(0, 200) +
                (totalText.length > 200 ? '...' : '');
        }

        // Validate business rules
        if (this.noteInfo?.isPrivate && this.noteInfo?.isClientVisible) {
            return next(new Error('Private notes cannot be client visible'));
        }

        // Set audit info
        if (this.isModified() && !this.isNew) {
            this.auditInfo.lastModifiedAt = new Date();
        }

        // Validate action items due dates
        if (this.actionItems?.hasActionItems && this.actionItems?.actionItemsList?.length > 0) {
            for (const action of this.actionItems.actionItemsList) {
                if (action.status === 'Completed' && !action.completedDate) {
                    action.completedDate = new Date();
                }
                if (action.status === 'Completed' && !action.completedBy) {
                    action.completedBy = this.auditInfo?.lastModifiedBy || this.createdBy;
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});

// ** PRE-REMOVE MIDDLEWARE **
notesSchema.pre('remove', function (next) {
    // Prevent hard deletion - require soft delete instead
    if (!this.systemInfo.isDeleted) {
        return next(new Error('Use softDelete() method instead of remove()'));
    }
    next();
});

export const Notes = mongoose.model('Notes', notesSchema, 'notes');