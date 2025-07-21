// backend/src/models/system/comments.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import plugin from '../../plugins/scopedIdPlugin.js';

const commentsSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    commentId: {
        type: String,
        unique: true,
        // default: () => `CMT-${uuidv4().toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // ** COMMENT ASSOCIATION **
    associatedEntity: {
        entityType: {
            type: String,
            enum: [
                'Claim', 'Patient', 'Employee', 'Client', 'SOW', 'Payer',
                'ClaimBatch', 'EDIFile', 'QAReview', 'Workflow', 'SLA',
                'Payment', 'Denial', 'Authorization', 'Company', 'General'
            ],
            required: [true, 'Entity type is required'],
            index: true
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Entity ID is required'],
            index: true
        },
        entityName: {
            type: String,
            trim: true // Display name for UI reference
        },
        entityContext: {
            type: Map,
            of: String // Additional context like claim number, patient name, etc.
        }
    },

    // ** COMMENT CONTENT **
    content: {
        commentText: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            maxlength: [5000, 'Comment cannot exceed 5000 characters']
        },
        plainText: {
            type: String,
            trim: true // Stripped version for search and notifications
        },
        commentType: {
            type: String,
            enum: [
                'General Note', 'Follow-up', 'Internal Note', 'Client Communication',
                'QA Feedback', 'Escalation Note', 'Status Update', 'Resolution',
                'Training Note', 'Compliance Note', 'Error Report', 'Suggestion'
            ],
            required: [true, 'Comment type is required'],
            index: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical'],
            default: 'Normal',
            index: true
        },
        category: {
            type: String,
            enum: [
                'Process', 'Quality', 'Technical', 'Communication', 'Training',
                'Compliance', 'Financial', 'Clinical', 'Administrative', 'Other'
            ],
            default: 'Process'
        },
        isPrivate: {
            type: Boolean,
            default: false,
            index: true
        },
        isSystemGenerated: {
            type: Boolean,
            default: false,
            index: true
        }
    },

    // ** AUTHORSHIP & OWNERSHIP **
    author: {
        authorRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Author reference is required'],
            index: true
        },
        authorName: {
            type: String,
            required: [true, 'Author name is required'],
            trim: true
        },
        authorRole: {
            type: String,
            trim: true
        },
        authorDepartment: {
            type: String,
            trim: true
        }
    },

    // ** THREADING & REPLIES **
    threading: {
        isReply: {
            type: Boolean,
            default: false,
            index: true
        },
        parentCommentRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            index: true
        },
        threadId: {
            type: String,
            index: true // Groups related comments together
        },
        replyLevel: {
            type: Number,
            default: 0,
            min: [0, 'Reply level cannot be negative'],
            max: [5, 'Maximum reply depth is 5 levels']
        },
        replyCount: {
            type: Number,
            default: 0,
            min: [0, 'Reply count cannot be negative']
        },
        lastReplyDate: Date
    },

    // ** MENTIONS & NOTIFICATIONS **
    mentions: {
        mentionedUsers: [{
            userRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            userName: {
                type: String,
                required: true,
                trim: true
            },
            mentionPosition: {
                start: Number,
                end: Number
            },
            notified: {
                type: Boolean,
                default: false
            },
            notifiedAt: Date
        }],
        mentionedRoles: [{
            roleName: {
                type: String,
                required: true,
                trim: true
            },
            roleRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            },
            mentionPosition: {
                start: Number,
                end: Number
            }
        }],
        mentionedTeams: [{
            teamName: {
                type: String,
                required: true,
                trim: true
            },
            teamRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Department'
            },
            mentionPosition: {
                start: Number,
                end: Number
            }
        }]
    },

    // ** ATTACHMENTS **
    attachments: [{
        attachmentId: {
            type: String,
            default: () => `ATT-${uuidv4().substring(0, 8).toUpperCase()}`,
            index: true
        },
        fileName: {
            type: String,
            required: true,
            trim: true
        },
        originalFileName: {
            type: String,
            required: true,
            trim: true
        },
        fileType: {
            type: String,
            required: true,
            enum: [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain', 'text/csv', 'application/zip', 'application/x-rar-compressed'
            ]
        },
        fileSize: {
            type: Number,
            required: true,
            min: [0, 'File size cannot be negative'],
            max: [50 * 1024 * 1024, 'File size cannot exceed 50MB'] // 50MB limit
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        downloadCount: {
            type: Number,
            default: 0,
            min: [0, 'Download count cannot be negative']
        },
        checksum: {
            type: String,
            trim: true // For file integrity verification
        }
    }],

    // ** VISIBILITY & PERMISSIONS **
    visibility: {
        isVisible: {
            type: Boolean,
            default: true,
            index: true
        },
        visibilityScope: {
            type: String,
            enum: ['Public', 'Company', 'Department', 'Team', 'Role', 'Custom'],
            default: 'Company',
            index: true
        },
        allowedRoles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }],
        allowedDepartments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }],
        allowedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        restrictedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }]
    },

    // ** INTERACTION TRACKING **
    interactions: {
        viewCount: {
            type: Number,
            default: 0,
            min: [0, 'View count cannot be negative']
        },
        likeCount: {
            type: Number,
            default: 0,
            min: [0, 'Like count cannot be negative']
        },
        likes: [{
            userRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            likedAt: {
                type: Date,
                default: Date.now
            }
        }],
        reactions: [{
            userRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            reactionType: {
                type: String,
                enum: ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉', '💯'],
                required: true
            },
            reactedAt: {
                type: Date,
                default: Date.now
            }
        }],
        bookmarks: [{
            userRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            bookmarkedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },

    // ** STATUS & LIFECYCLE **
    status: {
        commentStatus: {
            type: String,
            enum: ['Active', 'Edited', 'Deleted', 'Hidden', 'Flagged', 'Archived'],
            default: 'Active',
            index: true
        },
        isEdited: {
            type: Boolean,
            default: false,
            index: true
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
            previousContent: {
                type: String,
                required: true
            },
            editReason: {
                type: String,
                trim: true
            }
        }],
        isResolved: {
            type: Boolean,
            default: false,
            index: true
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolvedAt: Date,
        resolutionNote: {
            type: String,
            trim: true
        }
    },

    // ** MODERATION & COMPLIANCE **
    moderation: {
        isFlagged: {
            type: Boolean,
            default: false,
            index: true
        },
        flagReason: {
            type: String,
            enum: [
                'Inappropriate Content', 'Spam', 'Harassment', 'Privacy Violation',
                'Compliance Issue', 'Security Concern', 'Misinformation', 'Other'
            ]
        },
        flaggedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        flaggedAt: Date,
        moderationStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Requires Review'],
            default: 'Approved'
        },
        moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        moderatedAt: Date,
        moderationNotes: {
            type: String,
            trim: true
        }
    },

    // ** TAGS & CATEGORIZATION **
    tags: {
        systemTags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        userTags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        autoTags: [{
            tag: {
                type: String,
                trim: true,
                lowercase: true
            },
            confidence: {
                type: Number,
                min: 0,
                max: 1
            },
            source: {
                type: String,
                enum: ['NLP', 'Keyword', 'Pattern', 'ML']
            }
        }]
    },

    // ** SEARCH & INDEXING **
    searchMeta: {
        searchableText: {
            type: String,
            index: 'text' // Full-text search index
        },
        keywords: [String],
        language: {
            type: String,
            default: 'en',
            enum: ['en', 'es', 'fr', 'de', 'pt', 'it']
        },
        sentiment: {
            type: String,
            enum: ['Positive', 'Neutral', 'Negative'],
            default: 'Neutral'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
commentsSchema.index({ companyRef: 1, 'associatedEntity.entityType': 1, 'associatedEntity.entityId': 1 });
commentsSchema.index({ 'author.authorRef': 1, createdAt: -1 });
commentsSchema.index({ 'threading.threadId': 1, 'threading.replyLevel': 1 });
commentsSchema.index({ 'content.commentType': 1, 'content.priority': 1 });
commentsSchema.index({ 'status.commentStatus': 1, 'visibility.isVisible': 1 });

// Compound indexes for complex queries
commentsSchema.index({
    companyRef: 1,
    'associatedEntity.entityType': 1,
    'associatedEntity.entityId': 1,
    'status.commentStatus': 1,
    createdAt: -1
});

commentsSchema.index({
    'mentions.mentionedUsers.userRef': 1,
    'status.commentStatus': 1,
    createdAt: -1
});

// ** VIRTUAL FIELDS **
commentsSchema.virtual('isThread').get(function () {
    return this.threading.replyCount > 0;
});

commentsSchema.virtual('hasAttachments').get(function () {
    return this.attachments && this.attachments.length > 0;
});

commentsSchema.virtual('hasMentions').get(function () {
    return (this.mentions.mentionedUsers && this.mentions.mentionedUsers.length > 0) ||
        (this.mentions.mentionedRoles && this.mentions.mentionedRoles.length > 0) ||
        (this.mentions.mentionedTeams && this.mentions.mentionedTeams.length > 0);
});

// ** INSTANCE METHODS **
commentsSchema.methods.addReply = function (replyData) {
    this.threading.replyCount++;
    this.threading.lastReplyDate = new Date();
    return this.save();
};

commentsSchema.methods.addLike = function (userId) {
    const existingLike = this.interactions.likes.find(
        like => like.userRef.toString() === userId.toString()
    );

    if (!existingLike) {
        this.interactions.likes.push({
            userRef: userId,
            likedAt: new Date()
        });
        this.interactions.likeCount++;
        return this.save();
    }
    return false;
};

commentsSchema.methods.removeLike = function (userId) {
    const likeIndex = this.interactions.likes.findIndex(
        like => like.userRef.toString() === userId.toString()
    );

    if (likeIndex > -1) {
        this.interactions.likes.splice(likeIndex, 1);
        this.interactions.likeCount = Math.max(0, this.interactions.likeCount - 1);
        return this.save();
    }
    return false;
};

commentsSchema.methods.editComment = function (newContent, editedBy, editReason) {
    this.status.editHistory.push({
        editedBy,
        editedAt: new Date(),
        previousContent: this.content.commentText,
        editReason
    });

    this.content.commentText = newContent;
    this.content.plainText = newContent.replace(/<[^>]*>/g, ''); // Strip HTML
    this.status.isEdited = true;
    this.searchMeta.searchableText = this.content.plainText;

    return this.save();
};

commentsSchema.methods.flagComment = function (flaggedBy, reason) {
    this.moderation.isFlagged = true;
    this.moderation.flaggedBy = flaggedBy;
    this.moderation.flaggedAt = new Date();
    this.moderation.flagReason = reason;
    this.moderation.moderationStatus = 'Pending';

    return this.save();
};

// ** STATIC METHODS **
commentsSchema.statics.findByEntity = function (entityType, entityId, options = {}) {
    const query = {
        'associatedEntity.entityType': entityType,
        'associatedEntity.entityId': entityId,
        'status.commentStatus': 'Active',
        'visibility.isVisible': true
    };

    return this.find(query)
        .populate('author.authorRef', 'personalInfo.firstName personalInfo.lastName')
        .populate('threading.parentCommentRef')
        .sort({
            'threading.isReply': 1,
            'threading.replyLevel': 1,
            createdAt: options.sortOrder || -1
        })
        .limit(options.limit || 100);
};

commentsSchema.statics.findThreads = function (entityType, entityId) {
    return this.find({
        'associatedEntity.entityType': entityType,
        'associatedEntity.entityId': entityId,
        'threading.isReply': false,
        'status.commentStatus': 'Active',
        'visibility.isVisible': true
    })
        .populate('author.authorRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ createdAt: -1 });
};

commentsSchema.statics.findMentions = function (userId, limit = 50) {
    return this.find({
        'mentions.mentionedUsers.userRef': userId,
        'status.commentStatus': 'Active',
        'visibility.isVisible': true
    })
        .populate('author.authorRef', 'personalInfo.firstName personalInfo.lastName')
        .populate('associatedEntity.entityId')
        .sort({ createdAt: -1 })
        .limit(limit);
};

// PLUGINS
commentsSchema.plugin(scopedIdPlugin, {
    idField: 'commentId',
    prefix: 'CMT',
    companyRefPath: 'companyRef'
});

// ** PRE-SAVE MIDDLEWARE **
commentsSchema.pre('save', function (next) {
    // Update searchable text
    this.searchMeta.searchableText = this.content.plainText || this.content.commentText.replace(/<[^>]*>/g, '');

    // Generate thread ID for new comments
    if (this.isNew && !this.threading.isReply) {
        this.threading.threadId = this.commentId;
    }

    // Extract plain text if not provided
    if (!this.content.plainText && this.content.commentText) {
        this.content.plainText = this.content.commentText.replace(/<[^>]*>/g, '');
    }

    next();
});

const Comment = mongoose.model('Comment', commentsSchema);
export default Comment;