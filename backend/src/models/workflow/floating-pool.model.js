// backend/src/models/workflow/floating-pool.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const floatingPoolSchema = new mongoose.Schema({
    poolId: {
        type: String,
        unique: true,
        default: () => `POOL-${uuidv4().substring(0, 10).toUpperCase()}`,
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
        ref: 'ClaimTask', // Claim in floating pool
        required: [true, 'Claim reference is required'],
        index: true,
    },
    clientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Client who owns the claim
        required: [true, 'Client reference is required'],
        index: true
    },
    sowRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SOW', // SOW for assignment rules
        required: [true, 'SOW reference is required'],
        index: true
    },

    // ** POOL ENTRY INFORMATION **
    entryInfo: {
        entryDateTime: {
            type: Date,
            default: Date.now,
            required: [true, 'Entry date time is required'],
            index: true
        },
        entryMethod: {
            type: String,
            enum: [
                'New Claim Import', 'Employee Logout', 'Reassignment', 
                'Overflow', 'Manual Release', 'System Timeout',
                'Escalation', 'Quality Hold', 'SLA Reset'
            ],
            required: [true, 'Entry method is required'],
            index: true
        },
        entryReason: {
            type: String,
            trim: true,
            maxlength: [300, 'Entry reason cannot exceed 300 characters']
        },
        previousEmployeeRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee' // Last employee who worked on this claim
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee' // Who added claim to floating pool
        },
        batchId: {
            type: String,
            trim: true,
            index: true // For batch processing
        },
        originalAssignmentDate: Date, // When claim was first assigned (before floating pool)
        timeInFloatingPool: {
            type: Number, // in hours
            default: 0,
            min: [0, 'Time in floating pool cannot be negative']
        }
    },

    // ** PRIORITY & RANKING **
    priorityInfo: {
        priorityScore: {
            type: Number,
            required: [true, 'Priority score is required'],
            min: [0, 'Priority score cannot be negative'],
            index: true
        },
        priorityLevel: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical', 'Urgent'],
            required: [true, 'Priority level is required'],
            default: 'Normal',
            index: true
        },
        
        // Factors affecting priority
        agingDays: {
            type: Number,
            required: [true, 'Aging days is required'],
            min: [0, 'Aging days cannot be negative'],
            index: true
        },
        claimValue: {
            type: Number,
            required: [true, 'Claim value is required'],
            min: [0, 'Claim value cannot be negative']
        },
        payerType: {
            type: String,
            enum: ['Medicare', 'Medicaid', 'Commercial', 'Self Pay', 'Workers Comp', 'Other'],
            required: [true, 'Payer type is required']
        },
        payerScore: {
            type: Number,
            min: [1, 'Payer score must be at least 1'],
            max: [10, 'Payer score cannot exceed 10'],
            default: 5
        },
        isDenied: {
            type: Boolean,
            default: false,
            index: true
        },
        denialType: {
            type: String,
            enum: ['Hard Denial', 'Soft Denial', 'Partial Denial', 'Not Denied'],
            default: 'Not Denied'
        },
        isAppeal: {
            type: Boolean,
            default: false,
            index: true
        },
        
        // Auto-calculated priority factors
        slaRisk: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None',
            index: true
        },
        clientPriority: {
            type: String,
            enum: ['Standard', 'High', 'Critical'],
            default: 'Standard'
        },
        complexityLevel: {
            type: String,
            enum: ['Simple', 'Standard', 'Complex', 'Highly Complex'],
            default: 'Standard'
        },
        
        // Dynamic priority adjustments
        priorityBoosts: [{
            boostType: {
                type: String,
                enum: ['Client Request', 'Management Priority', 'SLA Risk', 'High Value', 'VIP Patient'],
                required: true
            },
            boostValue: {
                type: Number,
                required: true,
                min: [0, 'Boost value cannot be negative']
            },
            appliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            appliedDate: {
                type: Date,
                default: Date.now
            },
            expiryDate: Date,
            reason: String,
            isActive: {
                type: Boolean,
                default: true
            }
        }],
        
        lastPriorityUpdate: {
            type: Date,
            default: Date.now
        }
    },

    // ** ASSIGNMENT CONSTRAINTS **
    assignmentConstraints: {
        // Skill requirements
        requiredSkills: [{
            skill: {
                type: String,
                enum: [
                    "Medical Coding", "ICD-10", "CPT", "HCPCS", "Prior Auth", 
                    "AR Calling", "Denial Management", "Payment Posting", 
                    "Eligibility Verification", "Insurance Knowledge", "EMR Systems",
                    "Excel Advanced", "Data Entry", "Customer Service", "Healthcare RCM"
                ]
            },
            proficiencyLevel: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
                default: "Intermediate"
            }
        }],
        
        // Experience requirements
        minExperienceLevel: {
            type: String,
            enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Expert', 'Any'],
            default: 'Any'
        },
        minExperienceYears: {
            type: Number,
            min: [0, 'Minimum experience years cannot be negative'],
            default: 0
        },
        
        // Role level requirements
        minRoleLevel: {
            type: Number,
            min: [1, 'Minimum role level must be at least 1'],
            max: [10, 'Minimum role level cannot exceed 10'],
            default: 1
        },
        
        // Assignment restrictions
        restrictedEmployees: [{
            employeeRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            restrictionReason: {
                type: String,
                enum: ['Performance Issue', 'Training', 'Conflict of Interest', 'Workload', 'Temporary', 'Other'],
                required: true
            },
            restrictedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            restrictionDate: {
                type: Date,
                default: Date.now
            },
            expiryDate: Date
        }],
        
        // Preferred employees
        preferredEmployees: [{
            employeeRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            preferenceReason: {
                type: String,
                enum: ['Expertise', 'Previous Work', 'Client Request', 'Performance', 'Other'],
                required: true
            },
            preferenceWeight: {
                type: Number,
                min: [1, 'Preference weight must be at least 1'],
                max: [10, 'Preference weight cannot exceed 10'],
                default: 5
            }
        }],
        
        // Business rules
        allowOverflow: {
            type: Boolean,
            default: true // Can this claim overflow to other SOWs if no capacity
        },
        maxAttemptsBeforeEscalation: {
            type: Number,
            min: [1, 'Max attempts must be at least 1'],
            default: 3
        },
        currentAttempts: {
            type: Number,
            default: 0,
            min: [0, 'Current attempts cannot be negative']
        }
    },

    // ** ASSIGNMENT ATTEMPTS HISTORY **
    assignmentHistory: {
        totalAttempts: {
            type: Number,
            default: 0,
            min: [0, 'Total attempts cannot be negative']
        },
        lastAttemptDate: Date,
        attemptDetails: [{
            attemptNumber: {
                type: Number,
                required: true,
                min: [1, 'Attempt number must be at least 1']
            },
            attemptDate: {
                type: Date,
                default: Date.now
            },
            attemptMethod: {
                type: String,
                enum: ['Auto Assignment', 'Manual Assignment', 'Batch Assignment', 'Priority Assignment'],
                required: true
            },
            targetEmployees: [{
                employeeRef: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Employee'
                },
                eligibilityScore: Number,
                workloadScore: Number,
                skillScore: Number,
                finalScore: Number,
                rejectionReason: String
            }],
            assignmentResult: {
                type: String,
                enum: ['Successful', 'Failed - No Capacity', 'Failed - No Skills', 'Failed - Restrictions', 'Failed - System Error'],
                required: true
            },
            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            failureReason: String,
            nextAttemptScheduled: Date,
            notes: String
        }],
        
        // Failure tracking
        consecutiveFailures: {
            type: Number,
            default: 0,
            min: [0, 'Consecutive failures cannot be negative']
        },
        lastSuccessfulAssignment: Date,
        escalationTriggered: {
            type: Boolean,
            default: false
        },
        escalationDate: Date,
        escalatedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },

    // ** WORKLOAD DISTRIBUTION **
    workloadInfo: {
        // Current capacity check
        eligibleEmployees: {
            type: Number,
            default: 0,
            min: [0, 'Eligible employees cannot be negative']
        },
        employeesAtCapacity: {
            type: Number,
            default: 0,
            min: [0, 'Employees at capacity cannot be negative']
        },
        estimatedAssignmentTime: {
            type: Date,
            index: true
        },
        
        // Distribution strategy
        distributionMethod: {
            type: String,
            enum: ['Round Robin', 'Least Loaded', 'Skill Based', 'Performance Based', 'Random'],
            default: 'Least Loaded'
        },
        loadBalancingScore: {
            type: Number,
            min: [0, 'Load balancing score cannot be negative'],
            default: 0
        },
        
        // Capacity planning
        teamCapacityUtilization: {
            type: Number,
            min: [0, 'Team capacity utilization cannot be negative'],
            max: [100, 'Team capacity utilization cannot exceed 100%'],
            default: 0
        },
        recommendedAction: {
            type: String,
            enum: ['Assign Immediately', 'Wait for Capacity', 'Escalate', 'Overflow to Other SOW', 'Add Resources'],
            default: 'Assign Immediately'
        }
    },

    // ** SLA & TIMING **
    slaInfo: {
        slaDeadline: {
            type: Date,
            index: true
        },
        slaHoursRemaining: {
            type: Number,
            default: 0
        },
        slaStatus: {
            type: String,
            enum: ['On Track', 'At Risk', 'Breached', 'Paused', 'Not Applicable'],
            default: 'On Track',
            index: true
        },
        breachRisk: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Imminent'],
            default: 'None',
            index: true
        },
        urgencyLevel: {
            type: String,
            enum: ['Normal', 'Urgent', 'Critical', 'Emergency'],
            default: 'Normal',
            index: true
        },
        
        // Assignment timing
        targetAssignmentTime: {
            type: Date,
            required: [true, 'Target assignment time is required'],
            index: true
        },
        maxWaitTime: {
            type: Number, // in hours
            default: 24,
            min: [1, 'Max wait time must be at least 1 hour']
        },
        actualWaitTime: {
            type: Number, // in hours
            default: 0,
            min: [0, 'Actual wait time cannot be negative']
        }
    },

    // ** ANALYTICS & TRACKING **
    analyticsInfo: {
        poolCategory: {
            type: String,
            enum: ['New Claims', 'Reassigned', 'Overflow', 'Quality Hold', 'Escalated', 'System Error'],
            required: [true, 'Pool category is required'],
            index: true
        },
        originalSource: {
            type: String,
            enum: ['Import', 'API', 'Manual Entry', 'Transfer', 'Reprocess'],
            required: [true, 'Original source is required']
        },
        
        // Performance metrics
        avgTimeToAssignment: {
            type: Number, // in hours
            default: 0
        },
        assignmentSuccessRate: {
            type: Number, // percentage
            min: [0, 'Assignment success rate cannot be negative'],
            max: [100, 'Assignment success rate cannot exceed 100%'],
            default: 100
        },
        
        // Trend analysis
        poolTrend: {
            type: String,
            enum: ['Increasing', 'Stable', 'Decreasing'],
            default: 'Stable'
        },
        expectedDwellTime: {
            type: Number, // in hours
            default: 4
        },
        
        // Business impact
        businessImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'Low'
        },
        clientVisibility: {
            type: Boolean,
            default: false // Is client aware of this delay
        }
    },

    // ** NOTIFICATIONS & ALERTS **
    notificationInfo: {
        notificationsEnabled: {
            type: Boolean,
            default: true
        },
        
        // Alert thresholds
        warningThresholdHours: {
            type: Number,
            default: 4,
            min: [1, 'Warning threshold must be at least 1 hour']
        },
        criticalThresholdHours: {
            type: Number,
            default: 8,
            min: [2, 'Critical threshold must be at least 2 hours']
        },
        
        // Notification status
        warningAlertSent: {
            type: Boolean,
            default: false
        },
        warningAlertDate: Date,
        criticalAlertSent: {
            type: Boolean,
            default: false
        },
        criticalAlertDate: Date,
        
        // Notification recipients
        notificationRecipients: [{
            recipientType: {
                type: String,
                enum: ['Manager', 'Team Lead', 'Admin', 'Client', 'System'],
                required: true
            },
            recipientRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            notificationMethod: {
                type: String,
                enum: ['Email', 'SMS', 'In-App', 'Slack', 'Teams'],
                required: true
            },
            thresholdType: {
                type: String,
                enum: ['Warning', 'Critical', 'All'],
                default: 'All'
            }
        }],
        
        // Escalation notifications
        escalationNotificationSent: {
            type: Boolean,
            default: false
        },
        escalationNotificationDate: Date
    },

    // ** RESOLUTION & EXIT **
    resolutionInfo: {
        isResolved: {
            type: Boolean,
            default: false,
            index: true
        },
        resolutionDateTime: Date,
        resolutionMethod: {
            type: String,
            enum: [
                'Assigned to Employee', 'Escalated to Manager', 'Transferred to Another SOW',
                'Cancelled', 'Merged with Another Claim', 'System Error Resolution',
                'Client Withdrawal', 'Manual Override'
            ]
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        resolutionNotes: {
            type: String,
            trim: true
        },
        
        // Performance metrics
        totalTimeInPool: {
            type: Number, // in hours
            min: [0, 'Total time in pool cannot be negative']
        },
        assignmentEfficiency: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor'],
            default: 'Good'
        },
        clientImpact: {
            type: String,
            enum: ['None', 'Minimal', 'Moderate', 'Significant'],
            default: 'None'
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isLocked: {
            type: Boolean,
            default: false,
            index: true
        },
        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lockedAt: Date,
        lockReason: String,
        
        // Processing status
        processingStatus: {
            type: String,
            enum: ['Ready', 'Processing', 'On Hold', 'Error', 'Complete'],
            default: 'Ready',
            index: true
        },
        lastProcessed: Date,
        nextProcessingScheduled: Date,
        
        // System flags
        systemFlags: [{
            flagType: {
                type: String,
                enum: ['High Priority', 'Complex Case', 'Client Escalation', 'System Error', 'Data Quality Issue'],
                required: true
            },
            flagReason: String,
            flaggedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            flaggedDate: {
                type: Date,
                default: Date.now
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }],
        
        // Error tracking
        errorCount: {
            type: Number,
            default: 0,
            min: [0, 'Error count cannot be negative']
        },
        lastError: String,
        lastErrorDate: Date
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
        
        // Activity log
        activityLog: [{
            action: {
                type: String,
                enum: [
                    'Added to Pool', 'Priority Updated', 'Assignment Attempted', 'Assigned',
                    'Escalated', 'Flagged', 'Locked', 'Unlocked', 'Resolved', 'Cancelled'
                ],
                required: true
            },
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            performedAt: {
                type: Date,
                default: Date.now
            },
            details: String,
            systemGenerated: {
                type: Boolean,
                default: false
            }
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
floatingPoolSchema.index({ companyRef: 1, claimRef: 1 }, { unique: true });
floatingPoolSchema.index({ companyRef: 1, 'resolutionInfo.isResolved': 1 });
floatingPoolSchema.index({ sowRef: 1, 'priorityInfo.priorityScore': -1 });
floatingPoolSchema.index({ 'priorityInfo.priorityLevel': 1, 'entryInfo.entryDateTime': 1 });
floatingPoolSchema.index({ 'slaInfo.slaStatus': 1, 'slaInfo.slaDeadline': 1 });
floatingPoolSchema.index({ 'systemInfo.processingStatus': 1, 'systemInfo.isActive': 1 });

// Compound indexes for complex queries
floatingPoolSchema.index({
    companyRef: 1,
    'resolutionInfo.isResolved': 1,
    'priorityInfo.priorityScore': -1,
    'entryInfo.entryDateTime': 1
});

floatingPoolSchema.index({
    sowRef: 1,
    'systemInfo.isActive': 1,
    'assignmentConstraints.minRoleLevel': 1
});

// ** VIRTUAL FIELDS **
floatingPoolSchema.virtual('currentWaitTimeHours').get(function() {
    if (this.resolutionInfo.isResolved) return 0;
    const now = new Date();
    return (now - this.entryInfo.entryDateTime) / (1000 * 60 * 60);
});

floatingPoolSchema.virtual('isOverdueForAssignment').get(function() {
    return new Date() > this.slaInfo.targetAssignmentTime && !this.resolutionInfo.isResolved;
});

floatingPoolSchema.virtual('urgencyScore').get(function() {
    let score = this.priorityInfo.priorityScore;
    
    // Boost for SLA risk
    if (this.slaInfo.breachRisk === 'Imminent') score += 50;
    else if (this.slaInfo.breachRisk === 'High') score += 30;
    else if (this.slaInfo.breachRisk === 'Medium') score += 15;
    
    // Boost for time in pool
    const hoursInPool = this.currentWaitTimeHours;
    if (hoursInPool > 24) score += 25;
    else if (hoursInPool > 12) score += 15;
    else if (hoursInPool > 6) score += 10;
    
    return Math.min(score, 1000); // Cap at 1000
});

floatingPoolSchema.virtual('claim', {
    ref: 'ClaimTask',
    localField: 'claimRef',
    foreignField: '_id',
    justOne: true
});

floatingPoolSchema.virtual('sow', {
    ref: 'SOW',
    localField: 'sowRef',
    foreignField: '_id',
    justOne: true
});

// ** STATIC METHODS **
floatingPoolSchema.statics.findByPriority = function(companyRef, sowRef = null, limit = 50) {
    const query = {
        companyRef,
        'resolutionInfo.isResolved': false,
        'systemInfo.isActive': true,
        'systemInfo.processingStatus': { $ne: 'On Hold' }
    };
    
    if (sowRef) query.sowRef = sowRef;
    
    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus financialInfo.grossCharges')
        .populate('clientRef', 'clientInfo.clientName')
        .sort({ 
            'priorityInfo.priorityScore': -1,
            'entryInfo.entryDateTime': 1
        })
        .limit(limit);
};

floatingPoolSchema.statics.findOverdueAssignments = function(companyRef, hoursOverdue = 4) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursOverdue);
    
    return this.find({
        companyRef,
        'resolutionInfo.isResolved': false,
        'entryInfo.entryDateTime': { $lte: cutoffTime },
        'systemInfo.isActive': true
    })
    .populate('claimRef', 'claimId workflowStatus.currentStatus')
    .populate('sowRef', 'sowName serviceDetails.serviceType')
    .sort({ 'entryInfo.entryDateTime': 1 });
};

floatingPoolSchema.statics.findSLAAtRisk = function(companyRef, hoursAhead = 24) {
    const riskTime = new Date();
    riskTime.setHours(riskTime.getHours() + hoursAhead);
    
    return this.find({
        companyRef,
        'resolutionInfo.isResolved': false,
        'slaInfo.slaDeadline': { $lte: riskTime },
        'systemInfo.isActive': true
    })
    .populate('claimRef', 'claimId workflowStatus.currentStatus')
    .sort({ 'slaInfo.slaDeadline': 1 });
};

floatingPoolSchema.statics.getPoolStatsBySOW = function(companyRef) {
    return this.aggregate([
        {
            $match: {
                companyRef: mongoose.Types.ObjectId(companyRef),
                'resolutionInfo.isResolved': false,
                'systemInfo.isActive': true
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
                totalClaims: { $sum: 1 },
                avgPriorityScore: { $avg: '$priorityInfo.priorityScore' },
                avgWaitTime: { $avg: '$priorityInfo.timeInFloatingPool' },
                highPriorityClaims: {
                    $sum: {
                        $cond: [{ $eq: ['$priorityInfo.priorityLevel', 'High'] }, 1, 0]
                    }
                },
                criticalClaims: {
                    $sum: {
                        $cond: [{ $eq: ['$priorityInfo.priorityLevel', 'Critical'] }, 1, 0]
                    }
                },
                slaAtRisk: {
                    $sum: {
                        $cond: [{ $in: ['$slaInfo.breachRisk', ['High', 'Imminent']] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { totalClaims: -1 } }
    ]);
};

floatingPoolSchema.statics.findForAssignment = function(employeeRef, sowRef, skillsRequired = [], maxClaims = 10) {
    const query = {
        sowRef,
        'resolutionInfo.isResolved': false,
        'systemInfo.isActive': true,
        'systemInfo.processingStatus': 'Ready',
        'assignmentConstraints.restrictedEmployees.employeeRef': { $ne: employeeRef }
    };
    
    // Add skill filtering if required
    if (skillsRequired.length > 0) {
        query['assignmentConstraints.requiredSkills.skill'] = { $in: skillsRequired };
    }
    
    return this.find(query)
        .populate('claimRef', 'claimId workflowStatus.currentStatus financialInfo.grossCharges priorityInfo.agingDays')
        .sort({ 
            'priorityInfo.priorityScore': -1,
            'entryInfo.entryDateTime': 1
        })
        .limit(maxClaims);
};

// ** INSTANCE METHODS **
floatingPoolSchema.methods.updatePriorityScore = function() {
    // Get SOW configuration for priority formula
    const sow = this.populated('sowRef') || this.sowRef;
    
    let weights;
    if (sow && sow.allocationConfig && sow.allocationConfig.priorityFormula) {
        weights = sow.allocationConfig.priorityFormula;
    } else {
        // Default weights
        weights = { agingWeight: 0.4, payerWeight: 0.3, denialWeight: 0.3 };
    }
    
    // Base score calculation
    let score = (this.priorityInfo.agingDays * weights.agingWeight * 10) +
                (this.priorityInfo.payerScore * weights.payerWeight * 10) +
                ((this.priorityInfo.isDenied ? 1 : 0) * weights.denialWeight * 100);
    
    // Apply priority boosts
    const activeBoosts = this.priorityInfo.priorityBoosts.filter(boost => 
        boost.isActive && (!boost.expiryDate || boost.expiryDate > new Date())
    );
    
    activeBoosts.forEach(boost => {
        score += boost.boostValue;
    });
    
    // Apply SLA risk multiplier
    switch (this.slaInfo.breachRisk) {
        case 'Imminent':
            score *= 2.0;
            break;
        case 'High':
            score *= 1.5;
            break;
        case 'Medium':
            score *= 1.2;
            break;
    }
    
    // Apply time-in-pool penalty
    const hoursInPool = this.currentWaitTimeHours;
    if (hoursInPool > 24) score += 100;
    else if (hoursInPool > 12) score += 50;
    else if (hoursInPool > 6) score += 25;
    
    this.priorityInfo.priorityScore = Math.round(score);
    this.priorityInfo.lastPriorityUpdate = new Date();
    
    // Update priority level based on score
    if (this.priorityInfo.priorityScore >= 500) {
        this.priorityInfo.priorityLevel = 'Urgent';
    } else if (this.priorityInfo.priorityScore >= 300) {
        this.priorityInfo.priorityLevel = 'Critical';
    } else if (this.priorityInfo.priorityScore >= 150) {
        this.priorityInfo.priorityLevel = 'High';
    } else if (this.priorityInfo.priorityScore >= 50) {
        this.priorityInfo.priorityLevel = 'Normal';
    } else {
        this.priorityInfo.priorityLevel = 'Low';
    }
    
    return this.priorityInfo.priorityScore;
};

floatingPoolSchema.methods.attemptAssignment = function(employeeRef, attemptMethod = 'Auto Assignment') {
    this.assignmentHistory.totalAttempts += 1;
    this.assignmentHistory.lastAttemptDate = new Date();
    
    const attempt = {
        attemptNumber: this.assignmentHistory.totalAttempts,
        attemptMethod,
        assignmentResult: 'Successful',
        assignedTo: employeeRef
    };
    
    this.assignmentHistory.attemptDetails.push(attempt);
    this.assignmentConstraints.currentAttempts += 1;
    
    // Log activity
    this.auditInfo.activityLog.push({
        action: 'Assignment Attempted',
        details: `Attempt ${this.assignmentHistory.totalAttempts} - Assigned to employee ${employeeRef}`
    });
    
    return attempt;
};

floatingPoolSchema.methods.failAssignment = function(reason, nextAttemptTime = null) {
    this.assignmentHistory.consecutiveFailures += 1;
    this.assignmentConstraints.currentAttempts += 1;
    
    // Update last attempt
    const lastAttempt = this.assignmentHistory.attemptDetails[this.assignmentHistory.attemptDetails.length - 1];
    if (lastAttempt) {
        lastAttempt.assignmentResult = `Failed - ${reason}`;
        lastAttempt.failureReason = reason;
        lastAttempt.nextAttemptScheduled = nextAttemptTime;
    }
    
    // Check if escalation is needed
    if (this.assignmentConstraints.currentAttempts >= this.assignmentConstraints.maxAttemptsBeforeEscalation) {
        this.triggerEscalation('Max assignment attempts reached');
    }
    
    // Log activity
    this.auditInfo.activityLog.push({
        action: 'Assignment Attempted',
        details: `Assignment failed: ${reason}`,
        systemGenerated: true
    });
};

floatingPoolSchema.methods.triggerEscalation = function(reason, escalatedTo = null) {
    this.assignmentHistory.escalationTriggered = true;
    this.assignmentHistory.escalationDate = new Date();
    this.assignmentHistory.escalatedTo = escalatedTo;
    
    // Update analytics
    this.analyticsInfo.businessImpact = 'High';
    this.priorityInfo.priorityLevel = 'Critical';
    
    // Add priority boost
    this.priorityInfo.priorityBoosts.push({
        boostType: 'Management Priority',
        boostValue: 200,
        reason: reason,
        appliedDate: new Date()
    });
    
    // Recalculate priority
    this.updatePriorityScore();
    
    // Send escalation notification
    this.notificationInfo.escalationNotificationSent = true;
    this.notificationInfo.escalationNotificationDate = new Date();
    
    // Log activity
    this.auditInfo.activityLog.push({
        action: 'Escalated',
        details: reason,
        systemGenerated: true
    });
};

floatingPoolSchema.methods.resolve = function(resolutionMethod, assignedTo = null, resolvedBy = null, notes = '') {
    this.resolutionInfo.isResolved = true;
    this.resolutionInfo.resolutionDateTime = new Date();
    this.resolutionInfo.resolutionMethod = resolutionMethod;
    this.resolutionInfo.assignedTo = assignedTo;
    this.resolutionInfo.resolvedBy = resolvedBy;
    this.resolutionInfo.resolutionNotes = notes;
    
    // Calculate total time in pool
    const totalTime = (new Date() - this.entryInfo.entryDateTime) / (1000 * 60 * 60);
    this.resolutionInfo.totalTimeInPool = totalTime;
    
    // Determine assignment efficiency
    if (totalTime <= 2) {
        this.resolutionInfo.assignmentEfficiency = 'Excellent';
    } else if (totalTime <= 6) {
        this.resolutionInfo.assignmentEfficiency = 'Good';
    } else if (totalTime <= 24) {
        this.resolutionInfo.assignmentEfficiency = 'Average';
    } else {
        this.resolutionInfo.assignmentEfficiency = 'Poor';
    }
    
    // Determine client impact
    if (totalTime <= 4) {
        this.resolutionInfo.clientImpact = 'None';
    } else if (totalTime <= 12) {
        this.resolutionInfo.clientImpact = 'Minimal';
    } else if (totalTime <= 24) {
        this.resolutionInfo.clientImpact = 'Moderate';
    } else {
        this.resolutionInfo.clientImpact = 'Significant';
    }
    
    // Log activity
    this.auditInfo.activityLog.push({
        action: 'Resolved',
        performedBy: resolvedBy,
        details: `${resolutionMethod} - Total time in pool: ${totalTime.toFixed(2)} hours`
    });
};

floatingPoolSchema.methods.addPriorityBoost = function(boostType, boostValue, appliedBy, reason = '', expiryDate = null) {
    this.priorityInfo.priorityBoosts.push({
        boostType,
        boostValue,
        appliedBy,
        reason,
        expiryDate,
        appliedDate: new Date(),
        isActive: true
    });
    
    // Recalculate priority
    this.updatePriorityScore();
    
    // Log activity
    this.auditInfo.activityLog.push({
        action: 'Priority Updated',
        performedBy: appliedBy,
        details: `Added ${boostType} boost: +${boostValue} points. Reason: ${reason}`
    });
};

floatingPoolSchema.methods.checkAndSendAlerts = function() {
    const waitTime = this.currentWaitTimeHours;
    
    // Send warning alert
    if (waitTime >= this.notificationInfo.warningThresholdHours && 
        !this.notificationInfo.warningAlertSent) {
        this.notificationInfo.warningAlertSent = true;
        this.notificationInfo.warningAlertDate = new Date();
        
        // In real implementation, send actual notifications here
        console.log(`Warning: Claim ${this.claimRef} in floating pool for ${waitTime} hours`);
    }
    
    // Send critical alert
    if (waitTime >= this.notificationInfo.criticalThresholdHours && 
        !this.notificationInfo.criticalAlertSent) {
        this.notificationInfo.criticalAlertSent = true;
        this.notificationInfo.criticalAlertDate = new Date();
        
        console.log(`Critical: Claim ${this.claimRef} in floating pool for ${waitTime} hours`);
    }
};

// ** PRE-SAVE MIDDLEWARE **
floatingPoolSchema.pre('save', function(next) {
    // Update time in floating pool
    if (!this.resolutionInfo.isResolved) {
        const timeInPoolMs = new Date() - this.entryInfo.entryDateTime;
        this.entryInfo.timeInFloatingPool = timeInPoolMs / (1000 * 60 * 60);
    }
    
    // Update SLA information
    if (this.slaInfo.slaDeadline) {
        const now = new Date();
        this.slaInfo.slaHoursRemaining = Math.max(0, (this.slaInfo.slaDeadline - now) / (1000 * 60 * 60));
        
        // Update SLA status and breach risk
        if (now > this.slaInfo.slaDeadline) {
            this.slaInfo.slaStatus = 'Breached';
            this.slaInfo.breachRisk = 'Imminent';
        } else {
            const hoursUntilBreach = this.slaInfo.slaHoursRemaining;
            if (hoursUntilBreach <= 2) {
                this.slaInfo.breachRisk = 'Imminent';
                this.slaInfo.urgencyLevel = 'Emergency';
            } else if (hoursUntilBreach <= 6) {
                this.slaInfo.breachRisk = 'High';
                this.slaInfo.urgencyLevel = 'Critical';
            } else if (hoursUntilBreach <= 12) {
                this.slaInfo.breachRisk = 'Medium';
                this.slaInfo.urgencyLevel = 'Urgent';
            }
        }
    }
    
    // Update priority score
    this.updatePriorityScore();
    
    // Check and send alerts
    if (this.notificationInfo.notificationsEnabled && !this.resolutionInfo.isResolved) {
        this.checkAndSendAlerts();
    }
    
    // Set lastModifiedAt
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }
    
    next();
});

export const FloatingPool = mongoose.model('FloatingPool', floatingPoolSchema, 'floatingpool');