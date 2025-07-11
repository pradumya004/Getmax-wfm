// backend/src/models/qaAudit.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const qaAuditSchema = new mongoose.Schema({
    qaId: {
        type: String,
        unique: true,
        default: () => `QA-${uuidv4().substring(0, 10).toUpperCase()}`,
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
        ref: 'ClaimTasks', // Claim being audited
        required: [true, 'Claim reference is required'],
        index: true
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client for QA rules
        required: [true, 'Client reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW', // SOW for QA configuration
        required: [true, 'SOW reference is required'],
        index: true
    },
    originalEmployeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Employee who originally worked on claim
        required: [true, 'Original employee reference is required'],
        index: true
    },
    qaReviewerRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // QA reviewer
        required: [true, 'QA reviewer reference is required'],
        index: true
    },

    // ** QA CONFIGURATION & SETUP **
    qaConfig: {
        qaType: {
            type: String,
            enum: [
                'Random Sample', 'Targeted Review', 'New Employee', 'High Value Claim',
                'Client Request', 'Error Pattern', 'Compliance Check', 'Appeal Review',
                'Denial Analysis', 'Payment Verification', 'Manual Selection'
            ],
            required: [true, 'QA type is required'],
            index: true
        },
        qaReason: {
            type: String,
            trim: true,
            maxlength: [200, 'QA reason cannot exceed 200 characters']
        },
        samplingMethod: {
            type: String,
            enum: ['Random', 'Systematic', 'Stratified', 'Convenience', 'Targeted'],
            default: 'Random'
        },
        batchId: {
            type: String,
            trim: true,
            index: true // For batch QA processing
        },
        qaTemplate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QATemplate'
        },
        templateVersion: {
            type: String,
            default: '1.0'
        },
        isBlindReview: {
            type: Boolean,
            default: false // If true, reviewer doesn't see original employee's name
        }
    },

    // ** QA STATUS & WORKFLOW **
    qaStatus: {
        currentStatus: {
            type: String,
            enum: [
                'Assigned', 'In Review', 'Completed', 'Failed', 'Passed',
                'Pending Rebuttal', 'Rebuttal Accepted', 'Rebuttal Rejected',
                'Re-review Required', 'Escalated', 'Cancelled'
            ],
            required: [true, 'QA status is required'],
            default: 'Assigned',
            index: true
        },
        assignedDate: {
            type: Date,
            default: Date.now,
            index: true
        },
        startedDate: Date,
        completedDate: Date,
        dueDate: {
            type: Date,
            required: [true, 'QA due date is required'],
            index: true
        },
        isOverdue: {
            type: Boolean,
            default: false,
            index: true
        },
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            changedAt: {
                type: Date,
                required: true,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reason: String,
            notes: String
        }]
    },

    // ** SCORING SYSTEM **
    scoringInfo: {
        totalScore: {
            type: Number,
            min: [0, 'Total score cannot be negative'],
            max: [100, 'Total score cannot exceed 100'],
            default: 0,
            index: true
        },
        passingScore: {
            type: Number,
            min: [0, 'Passing score cannot be negative'],
            max: [100, 'Passing score cannot exceed 100'],
            default: 85
        },
        isPassed: {
            type: Boolean,
            default: false,
            index: true
        },
        
        // Category-wise scoring
        categoryScores: [{
            categoryName: {
                type: String,
                required: true,
                enum: [
                    'Data Accuracy', 'Process Compliance', 'Communication Quality',
                    'Documentation', 'Coding Accuracy', 'Financial Accuracy',
                    'Customer Service', 'Technical Skills', 'Follow-up',
                    'Resolution Quality', 'Timeliness', 'Other'
                ]
            },
            maxPoints: {
                type: Number,
                required: true,
                min: [1, 'Max points must be at least 1']
            },
            earnedPoints: {
                type: Number,
                required: true,
                min: [0, 'Earned points cannot be negative']
            },
            percentage: {
                type: Number,
                min: [0, 'Percentage cannot be negative'],
                max: [100, 'Percentage cannot exceed 100']
            },
            weightage: {
                type: Number,
                min: [0, 'Weightage cannot be negative'],
                max: [100, 'Weightage cannot exceed 100'],
                default: 10
            },
            notes: String
        }],
        
        // Weighted scoring
        useWeightedScoring: {
            type: Boolean,
            default: true
        },
        weightedScore: {
            type: Number,
            min: [0, 'Weighted score cannot be negative'],
            max: [100, 'Weighted score cannot exceed 100'],
            default: 0
        }
    },

    // ** ERROR TRACKING **
    errorTracking: {
        totalErrors: {
            type: Number,
            default: 0,
            min: [0, 'Total errors cannot be negative']
        },
        criticalErrors: {
            type: Number,
            default: 0,
            min: [0, 'Critical errors cannot be negative']
        },
        majorErrors: {
            type: Number,
            default: 0,
            min: [0, 'Major errors cannot be negative']
        },
        minorErrors: {
            type: Number,
            default: 0,
            min: [0, 'Minor errors cannot be negative']
        },
        
        errors: [{
            errorId: {
                type: String,
                default: () => `ERR-${uuidv4().substring(0, 6).toUpperCase()}`
            },
            errorCategory: {
                type: String,
                enum: [
                    'Data Entry', 'Process Flow', 'Communication', 'Documentation',
                    'Coding', 'Financial', 'Compliance', 'Technical', 'Follow-up',
                    'Customer Service', 'Resolution', 'Other'
                ],
                required: true
            },
            errorType: {
                type: String,
                enum: [
                    'Missing Information', 'Incorrect Information', 'Wrong Process',
                    'Incomplete Task', 'Poor Communication', 'Late Response',
                    'Incorrect Code', 'Wrong Amount', 'Missing Documentation',
                    'Non-compliance', 'Technical Error', 'Other'
                ],
                required: true
            },
            severity: {
                type: String,
                enum: ['Critical', 'Major', 'Minor', 'Cosmetic'],
                required: true,
                default: 'Minor'
            },
            description: {
                type: String,
                required: true,
                trim: true,
                maxlength: [500, 'Error description cannot exceed 500 characters']
            },
            expectedAction: {
                type: String,
                trim: true,
                maxlength: [200, 'Expected action cannot exceed 200 characters']
            },
            actualAction: {
                type: String,
                trim: true,
                maxlength: [200, 'Actual action cannot exceed 200 characters']
            },
            rootCause: {
                type: String,
                enum: [
                    'Lack of Knowledge', 'Training Gap', 'System Issue', 'Process Unclear',
                    'Time Pressure', 'Communication Breakdown', 'Resource Constraint',
                    'Human Error', 'Technical Problem', 'Other'
                ]
            },
            correctiveAction: {
                type: String,
                trim: true
            },
            pointsDeducted: {
                type: Number,
                min: [0, 'Points deducted cannot be negative'],
                default: 0
            },
            isSystematic: {
                type: Boolean,
                default: false // If this error occurs frequently
            },
            recurrenceCount: {
                type: Number,
                default: 1,
                min: [1, 'Recurrence count must be at least 1']
            }
        }]
    },

    // ** QA REVIEW DETAILS **
    reviewDetails: {
        reviewStartTime: Date,
        reviewEndTime: Date,
        reviewDurationMinutes: {
            type: Number,
            min: [0, 'Review duration cannot be negative'],
            default: 0
        },
        
        // Areas reviewed
        areasReviewed: [{
            areaName: {
                type: String,
                required: true,
                enum: [
                    'Patient Demographics', 'Insurance Information', 'Claim Details',
                    'Procedure Codes', 'Diagnosis Codes', 'Charges', 'Payments',
                    'Notes Quality', 'Follow-up Actions', 'Communication',
                    'Documentation', 'Process Compliance', 'Other'
                ]
            },
            status: {
                type: String,
                enum: ['Passed', 'Failed', 'Not Applicable', 'Needs Improvement'],
                required: true
            },
            score: {
                type: Number,
                min: [0, 'Score cannot be negative'],
                max: [100, 'Score cannot exceed 100']
            },
            comments: String,
            reviewTime: {
                type: Number, // minutes spent on this area
                min: [0, 'Review time cannot be negative']
            }
        }],
        
        // Review methodology
        reviewMethodology: {
            type: String,
            enum: ['Standard Checklist', 'Risk-based', 'Comprehensive', 'Focused', 'Sampling'],
            default: 'Standard Checklist'
        },
        reviewDepth: {
            type: String,
            enum: ['Surface', 'Standard', 'Deep Dive', 'Comprehensive'],
            default: 'Standard'
        },
        
        // Overall assessment
        overallAssessment: {
            type: String,
            enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Unsatisfactory'],
            default: 'Satisfactory'
        },
        strengthsIdentified: [String],
        improvementAreas: [String],
        recommendations: [String]
    },

    // ** FEEDBACK & COMMUNICATION **
    feedbackInfo: {
        hasFeedback: {
            type: Boolean,
            default: false
        },
        feedbackType: {
            type: String,
            enum: ['Positive', 'Constructive', 'Corrective', 'Developmental'],
            default: 'Constructive'
        },
        feedbackSummary: {
            type: String,
            trim: true,
            maxlength: [1000, 'Feedback summary cannot exceed 1000 characters']
        },
        detailedFeedback: {
            type: String,
            trim: true,
            maxlength: [3000, 'Detailed feedback cannot exceed 3000 characters']
        },
        
        // Communication with employee
        feedbackDelivered: {
            type: Boolean,
            default: false
        },
        feedbackDeliveryMethod: {
            type: String,
            enum: ['In Person', 'Video Call', 'Phone Call', 'Email', 'Chat', 'System Notification'],
            default: 'System Notification'
        },
        feedbackDeliveredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        feedbackDeliveryDate: Date,
        
        // Employee acknowledgment
        employeeAcknowledged: {
            type: Boolean,
            default: false
        },
        acknowledgmentDate: Date,
        employeeResponse: {
            type: String,
            trim: true
        },
        
        // Follow-up actions
        trainingRequired: {
            type: Boolean,
            default: false
        },
        trainingTopics: [String],
        coachingRequired: {
            type: Boolean,
            default: false
        },
        followUpRequired: {
            type: Boolean,
            default: false
        },
        followUpDate: Date,
        followUpCompleted: {
            type: Boolean,
            default: false
        }
    },

    // ** REBUTTAL PROCESS **
    rebuttalInfo: {
        allowRebuttal: {
            type: Boolean,
            default: true
        },
        rebuttalSubmitted: {
            type: Boolean,
            default: false
        },
        rebuttalDeadline: {
            type: Date,
            default: function() {
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 3); // 3 days to submit rebuttal
                return deadline;
            }
        },
        
        rebuttals: [{
            submittedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            submittedDate: {
                type: Date,
                default: Date.now
            },
            rebuttalType: {
                type: String,
                enum: ['Score Dispute', 'Error Dispute', 'Process Clarification', 'Other'],
                required: true
            },
            disputedItems: [String], // List of specific items being disputed
            rebuttalText: {
                type: String,
                required: true,
                trim: true,
                maxlength: [2000, 'Rebuttal text cannot exceed 2000 characters']
            },
            supportingEvidence: [String], // File paths or references
            
            // Rebuttal review
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            reviewedDate: Date,
            reviewStatus: {
                type: String,
                enum: ['Pending', 'Accepted', 'Partially Accepted', 'Rejected'],
                default: 'Pending'
            },
            reviewNotes: String,
            scoreAdjustment: {
                type: Number,
                default: 0
            },
            finalDecision: String
        }]
    },

    // ** CALIBRATION & CONSISTENCY **
    calibrationInfo: {
        isCalibrationAudit: {
            type: Boolean,
            default: false
        },
        calibrationGroup: String,
        calibrationRound: Number,
        
        // Secondary reviewer for calibration
        secondaryReviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        secondaryScore: Number,
        scoreVariance: {
            type: Number,
            default: 0
        },
        reviewerAgreement: {
            type: String,
            enum: ['Complete', 'Substantial', 'Moderate', 'Minimal', 'None'],
            default: 'Complete'
        },
        
        // Calibration metrics
        calibrationNotes: String,
        requiresDiscussion: {
            type: Boolean,
            default: false
        },
        discussionCompleted: {
            type: Boolean,
            default: false
        },
        consensusReached: {
            type: Boolean,
            default: false
        }
    },

    // ** REMEDIATION & IMPROVEMENT **
    remediationInfo: {
        requiresRemediation: {
            type: Boolean,
            default: false
        },
        remediationType: {
            type: String,
            enum: ['Re-work', 'Training', 'Coaching', 'Process Change', 'System Fix', 'Other']
        },
        remediationPlan: {
            type: String,
            trim: true
        },
        remediationAssignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        remediationDueDate: Date,
        remediationCompleted: {
            type: Boolean,
            default: false
        },
        remediationCompletedDate: Date,
        remediationNotes: String,
        
        // Impact tracking
        businessImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        },
        clientImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        },
        financialImpact: {
            type: Number,
            default: 0
        },
        processImprovementSuggestions: [String]
    },

    // ** APPROVAL WORKFLOW **
    approvalInfo: {
        requiresApproval: {
            type: Boolean,
            default: false
        },
        approvalLevel: {
            type: String,
            enum: ['QA Manager', 'Operations Manager', 'Director', 'VP'],
            default: 'QA Manager'
        },
        approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvalStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Needs Revision'],
            default: 'Pending'
        },
        approvedDate: Date,
        approvalNotes: String,
        rejectionReason: String
    },

    // ** ANALYTICS & REPORTING **
    analyticsInfo: {
        claimComplexity: {
            type: String,
            enum: ['Simple', 'Standard', 'Complex', 'Highly Complex'],
            default: 'Standard'
        },
        reviewComplexity: {
            type: String,
            enum: ['Simple', 'Standard', 'Complex', 'Highly Complex'],
            default: 'Standard'
        },
        riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
        },
        confidenceLevel: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'High'
        },
        reviewAccuracy: {
            type: Number,
            min: [0, 'Review accuracy cannot be negative'],
            max: [100, 'Review accuracy cannot exceed 100'],
            default: 100
        },
        
        // Trend analysis
        employeePerformanceTrend: {
            type: String,
            enum: ['Improving', 'Stable', 'Declining', 'Inconsistent'],
            default: 'Stable'
        },
        isOutlier: {
            type: Boolean,
            default: false
        },
        benchmarkComparison: {
            type: String,
            enum: ['Above Average', 'Average', 'Below Average'],
            default: 'Average'
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
        qaVersion: {
            type: String,
            default: '1.0'
        },
        automatedFlags: [{
            flagType: String,
            flagReason: String,
            flaggedAt: {
                type: Date,
                default: Date.now
            }
        }],
        dataSource: {
            type: String,
            enum: ['Manual QA', 'Automated QA', 'Hybrid', 'Import'],
            default: 'Manual QA'
        }
    },

    // ** AUDIT TRAIL **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Created by reference is required']
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        reviewHistory: [{
            action: {
                type: String,
                enum: ['Created', 'Started', 'Scored', 'Completed', 'Approved', 'Rejected', 'Rebuttal Submitted', 'Rebuttal Reviewed'],
                required: true
            },
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            performedAt: {
                type: Date,
                default: Date.now
            },
            details: String,
            previousValue: String,
            newValue: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
qaAuditSchema.index({ companyRef: 1, 'qaStatus.currentStatus': 1 });
qaAuditSchema.index({ originalEmployeeRef: 1, 'qaStatus.completedDate': -1 });
qaAuditSchema.index({ qaReviewerRef: 1, 'qaStatus.assignedDate': -1 });
qaAuditSchema.index({ claimRef: 1, 'systemInfo.isActive': 1 });
qaAuditSchema.index({ 'scoringInfo.totalScore': -1, 'scoringInfo.isPassed': 1 });
qaAuditSchema.index({ 'qaConfig.batchId': 1, 'qaStatus.currentStatus': 1 });

// Compound indexes for complex queries
qaAuditSchema.index({
    companyRef: 1,
    'qaStatus.currentStatus': 1,
    'qaStatus.dueDate': 1
});

qaAuditSchema.index({
    sowRef: 1,
    'qaConfig.qaType': 1,
    'qaStatus.completedDate': -1
});

// ** VIRTUAL FIELDS **
qaAuditSchema.virtual('isOverdueComputed').get(function() {
    return new Date() > this.qaStatus.dueDate && 
           !['Completed', 'Cancelled'].includes(this.qaStatus.currentStatus);
});

qaAuditSchema.virtual('scoreCategory').get(function() {
    if (this.scoringInfo.totalScore >= 95) return 'Excellent';
    if (this.scoringInfo.totalScore >= 90) return 'Good';
    if (this.scoringInfo.totalScore >= 85) return 'Satisfactory';
    if (this.scoringInfo.totalScore >= 70) return 'Needs Improvement';
    return 'Unsatisfactory';
});

qaAuditSchema.virtual('errorRate').get(function() {
    const totalItems = this.reviewDetails.areasReviewed.length;
    if (totalItems === 0) return 0;
    return (this.errorTracking.totalErrors / totalItems) * 100;
});

qaAuditSchema.virtual('originalEmployee', {
    ref: 'Employee',
    localField: 'originalEmployeeRef',
    foreignField: '_id',
    justOne: true
});

qaAuditSchema.virtual('qaReviewer', {
    ref: 'Employee',
    localField: 'qaReviewerRef',
    foreignField: '_id',
    justOne: true
});

qaAuditSchema.virtual('claim', {
    ref: 'ClaimTasks',
    localField: 'claimRef',
    foreignField: '_id',
    justOne: true
});

// ** STATIC METHODS **
qaAuditSchema.statics.findPendingQA = function(companyRef, reviewerRef = null) {
    const query = {
        companyRef,
        'qaStatus.currentStatus': { $in: ['Assigned', 'In Review'] },
        'systemInfo.isActive': true
    };
    
    if (reviewerRef) {
        query.qaReviewerRef = reviewerRef;
    }
    
    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus')
        .populate('originalEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
        .sort({ 'qaStatus.dueDate': 1 });
};

qaAuditSchema.statics.getEmployeeQAStats = function(employeeRef, fromDate, toDate) {
    const matchStage = {
        originalEmployeeRef: mongoose.Types.ObjectId(employeeRef),
        'qaStatus.currentStatus': 'Completed',
        'qaStatus.completedDate': {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        }
    };
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalAudits: { $sum: 1 },
                totalScore: { $avg: '$scoringInfo.totalScore' },
                passCount: {
                    $sum: { $cond: [{ $eq: ['$scoringInfo.isPassed', true] }, 1, 0] }
                },
                failCount: {
                    $sum: { $cond: [{ $eq: ['$scoringInfo.isPassed', false] }, 1, 0] }
                },
                totalErrors: { $sum: '$errorTracking.totalErrors' },
                criticalErrors: { $sum: '$errorTracking.criticalErrors' },
                majorErrors: { $sum: '$errorTracking.majorErrors' },
                minorErrors: { $sum: '$errorTracking.minorErrors' }
            }
        },
        {
            $addFields: {
                passRate: {
                    $multiply: [
                        { $divide: ['$passCount', '$totalAudits'] },
                        100
                    ]
                },
                errorRate: {
                    $divide: ['$totalErrors', '$totalAudits']
                }
            }
        }
    ]);
};

qaAuditSchema.statics.findByScoreRange = function(companyRef, minScore, maxScore, fromDate = null, toDate = null) {
    const query = {
        companyRef,
        'scoringInfo.totalScore': { $gte: minScore, $lte: maxScore },
        'qaStatus.currentStatus': 'Completed',
        'systemInfo.isActive': true
    };
    
    if (fromDate || toDate) {
        query['qaStatus.completedDate'] = {};
        if (fromDate) query['qaStatus.completedDate'].$gte = new Date(fromDate);
        if (toDate) query['qaStatus.completedDate'].$lte = new Date(toDate);
    }
    
    return this.find(query)
        .populate('originalEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
        .populate('claimRef', 'claimId financialInfo.grossCharges')
        .sort({ 'qaStatus.completedDate': -1 });
};

qaAuditSchema.statics.findPendingRebuttal = function(companyRef) {
    return this.find({
        companyRef,
        'qaStatus.currentStatus': 'Pending Rebuttal',
        'rebuttalInfo.allowRebuttal': true,
        'rebuttalInfo.rebuttalDeadline': { $gte: new Date() },
        'systemInfo.isActive': true
    })
    .populate('originalEmployeeRef', 'personalInfo.firstName personalInfo.lastName')
    .populate('claimRef', 'claimId')
    .sort({ 'rebuttalInfo.rebuttalDeadline': 1 });
};

qaAuditSchema.statics.getQAPerformanceBySOW = function(companyRef, fromDate, toDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: mongoose.Types.ObjectId(companyRef),
                'qaStatus.currentStatus': 'Completed',
                'qaStatus.completedDate': {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }
            }
        },
        {
            $lookup: {
                from: 'sows',
                localField: 'sowRef',
                foreignField: '_id',
                as: 'sow'
            }
        },
        { $unwind: '$sow' },
        {
            $group: {
                _id: {
                    sowId: '$sowRef',
                    sowName: '$sow.sowName',
                    serviceType: '$sow.serviceDetails.serviceType'
                },
                totalAudits: { $sum: 1 },
                avgScore: { $avg: '$scoringInfo.totalScore' },
                passRate: {
                    $avg: {
                        $cond: [{ $eq: ['$scoringInfo.isPassed', true] }, 100, 0]
                    }
                },
                avgErrors: { $avg: '$errorTracking.totalErrors' }
            }
        },
        { $sort: { avgScore: -1 } }
    ]);
};

// ** INSTANCE METHODS **
qaAuditSchema.methods.calculateTotalScore = function() {
    if (this.scoringInfo.useWeightedScoring) {
        let weightedSum = 0;
        let totalWeight = 0;
        
        this.scoringInfo.categoryScores.forEach(category => {
            const percentage = (category.earnedPoints / category.maxPoints) * 100;
            weightedSum += percentage * (category.weightage / 100);
            totalWeight += category.weightage;
        });
        
        this.scoringInfo.weightedScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
        this.scoringInfo.totalScore = this.scoringInfo.weightedScore;
    } else {
        let totalEarned = 0;
        let totalMax = 0;
        
        this.scoringInfo.categoryScores.forEach(category => {
            totalEarned += category.earnedPoints;
            totalMax += category.maxPoints;
            category.percentage = (category.earnedPoints / category.maxPoints) * 100;
        });
        
        this.scoringInfo.totalScore = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
    }
    
    this.scoringInfo.isPassed = this.scoringInfo.totalScore >= this.scoringInfo.passingScore;
    return this.scoringInfo.totalScore;
};

qaAuditSchema.methods.addError = function(errorData) {
    // Create error object
    const error = {
        errorCategory: errorData.category,
        errorType: errorData.type,
        severity: errorData.severity,
        description: errorData.description,
        expectedAction: errorData.expectedAction,
        actualAction: errorData.actualAction,
        rootCause: errorData.rootCause,
        pointsDeducted: errorData.pointsDeducted || 0
    };
    
    this.errorTracking.errors.push(error);
    
    // Update error counts
    this.errorTracking.totalErrors += 1;
    
    switch (errorData.severity) {
        case 'Critical':
            this.errorTracking.criticalErrors += 1;
            break;
        case 'Major':
            this.errorTracking.majorErrors += 1;
            break;
        case 'Minor':
            this.errorTracking.minorErrors += 1;
            break;
    }
    
    return error;
};

qaAuditSchema.methods.submitRebuttal = function(submittedBy, rebuttalData) {
    const rebuttal = {
        submittedBy,
        rebuttalType: rebuttalData.type,
        disputedItems: rebuttalData.disputedItems,
        rebuttalText: rebuttalData.text,
        supportingEvidence: rebuttalData.evidence || []
    };
    
    this.rebuttalInfo.rebuttals.push(rebuttal);
    this.rebuttalInfo.rebuttalSubmitted = true;
    this.qaStatus.currentStatus = 'Pending Rebuttal';
    
    // Add to status history
    this.qaStatus.statusHistory.push({
        status: 'Pending Rebuttal',
        changedBy: submittedBy,
        reason: 'Rebuttal submitted',
        notes: rebuttalData.text.substring(0, 100) + '...'
    });
    
    return rebuttal;
};

qaAuditSchema.methods.reviewRebuttal = function(reviewedBy, decision, notes = '', scoreAdjustment = 0) {
    const latestRebuttal = this.rebuttalInfo.rebuttals[this.rebuttalInfo.rebuttals.length - 1];
    
    latestRebuttal.reviewedBy = reviewedBy;
    latestRebuttal.reviewedDate = new Date();
    latestRebuttal.reviewStatus = decision;
    latestRebuttal.reviewNotes = notes;
    latestRebuttal.scoreAdjustment = scoreAdjustment;
    
    // Adjust score if needed
    if (scoreAdjustment !== 0) {
        this.scoringInfo.totalScore = Math.max(0, Math.min(100, this.scoringInfo.totalScore + scoreAdjustment));
        this.scoringInfo.isPassed = this.scoringInfo.totalScore >= this.scoringInfo.passingScore;
    }
    
    // Update status
    if (decision === 'Accepted' || decision === 'Partially Accepted') {
        this.qaStatus.currentStatus = 'Rebuttal Accepted';
    } else {
        this.qaStatus.currentStatus = 'Rebuttal Rejected';
    }
    
    // Add to status history
    this.qaStatus.statusHistory.push({
        status: this.qaStatus.currentStatus,
        changedBy: reviewedBy,
        reason: `Rebuttal ${decision.toLowerCase()}`,
        notes
    });
};

qaAuditSchema.methods.complete = function(completedBy, finalNotes = '') {
    this.qaStatus.currentStatus = 'Completed';
    this.qaStatus.completedDate = new Date();
    
    if (this.reviewDetails.reviewStartTime) {
        const duration = (new Date() - this.reviewDetails.reviewStartTime) / (1000 * 60);
        this.reviewDetails.reviewDurationMinutes = duration;
        this.reviewDetails.reviewEndTime = new Date();
    }
    
    // Calculate final score
    this.calculateTotalScore();
    
    // Determine overall assessment
    if (this.scoringInfo.totalScore >= 95) {
        this.reviewDetails.overallAssessment = 'Excellent';
    } else if (this.scoringInfo.totalScore >= 90) {
        this.reviewDetails.overallAssessment = 'Good';
    } else if (this.scoringInfo.totalScore >= 85) {
        this.reviewDetails.overallAssessment = 'Satisfactory';
    } else if (this.scoringInfo.totalScore >= 70) {
        this.reviewDetails.overallAssessment = 'Needs Improvement';
    } else {
        this.reviewDetails.overallAssessment = 'Unsatisfactory';
    }
    
    // Add to status history
    this.qaStatus.statusHistory.push({
        status: 'Completed',
        changedBy: completedBy,
        reason: 'QA review completed',
        notes: finalNotes
    });
    
    // Add to review history
    this.auditInfo.reviewHistory.push({
        action: 'Completed',
        performedBy: completedBy,
        details: `Score: ${this.scoringInfo.totalScore}%, Status: ${this.scoringInfo.isPassed ? 'Passed' : 'Failed'}`
    });
};

qaAuditSchema.methods.escalate = function(escalatedBy, reason, escalatedTo) {
    this.qaStatus.currentStatus = 'Escalated';
    
    // Add to status history
    this.qaStatus.statusHistory.push({
        status: 'Escalated',
        changedBy: escalatedBy,
        reason,
        notes: `Escalated to: ${escalatedTo}`
    });
    
    // Set approval requirement
    this.approvalInfo.requiresApproval = true;
    this.approvalInfo.approver = escalatedTo;
    this.approvalInfo.approvalStatus = 'Pending';
};

// ** PRE-SAVE MIDDLEWARE **
qaAuditSchema.pre('save', function(next) {
    // Check if overdue
    this.qaStatus.isOverdue = new Date() > this.qaStatus.dueDate && 
                              !['Completed', 'Cancelled'].includes(this.qaStatus.currentStatus);
    
    // Calculate scores if category scores exist
    if (this.scoringInfo.categoryScores.length > 0) {
        this.calculateTotalScore();
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

export const QAAudit = mongoose.model('QAAudit', qaAuditSchema, 'qaaudits');