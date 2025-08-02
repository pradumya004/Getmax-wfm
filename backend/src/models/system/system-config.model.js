// backend/src/models/system/system-config.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const systemConfigSchema = new mongoose.Schema({
    configId: {
        type: String,
        unique: true,
        default: () => `CONFIG-${uuidv4().substring(0, 10).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** CONFIGURATION IDENTIFICATION **
    configInfo: {
        configKey: {
            type: String,
            required: [true, 'Configuration key is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Configuration key cannot exceed 100 characters'],
            index: true,
            validate: {
                validator: function (v) {
                    return /^[A-Z_][A-Z0-9_]*$/.test(v);
                },
                message: 'Configuration key must be uppercase with underscores only'
            }
        },
        configName: {
            type: String,
            required: [true, 'Configuration name is required'],
            trim: true,
            maxlength: [200, 'Configuration name cannot exceed 200 characters']
        },
        description: {
            type: String,
            required: [true, 'Configuration description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        purpose: {
            type: String,
            trim: true,
            maxlength: [500, 'Purpose cannot exceed 500 characters']
        },
        configType: {
            type: String,
            enum: ['STRING', 'NUMBER', 'BOOLEAN', 'OBJECT', 'ARRAY', 'JSON', 'ENCRYPTED', 'URL', 'EMAIL', 'REGEX'],
            required: [true, 'Configuration type is required'],
            index: true
        },
        dataFormat: {
            type: String,
            trim: true,
            maxlength: [50, 'Data format cannot exceed 50 characters']
        }
    },

    // ** CONFIGURATION VALUE **
    configValue: {
        currentValue: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Configuration value is required']
        },
        encryptedValue: {
            type: String,
            select: false // Never return encrypted values by default
        },
        isEncrypted: {
            type: Boolean,
            default: false,
            index: true
        },
        encryptionMethod: {
            type: String,
            enum: ['AES256', 'RSA', 'bcrypt', 'none'],
            default: 'none'
        },
        defaultValue: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Default value is required']
        },
        previousValues: [{
            value: mongoose.Schema.Types.Mixed,
            changedAt: {
                type: Date,
                default: Date.now
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            changeReason: String,
            version: Number
        }],
        valueHistory: {
            maxHistorySize: {
                type: Number,
                default: 10,
                min: [1, 'History size must be at least 1'],
                max: [100, 'History size cannot exceed 100']
            },
            retentionDays: {
                type: Number,
                default: 90,
                min: [7, 'Retention must be at least 7 days']
            }
        }
    },

    // ** VALIDATION RULES **
    validationRules: {
        isRequired: {
            type: Boolean,
            default: true
        },
        allowNull: {
            type: Boolean,
            default: false
        },
        allowEmpty: {
            type: Boolean,
            default: false
        },
        minLength: {
            type: Number,
            min: [0, 'Minimum length cannot be negative']
        },
        maxLength: {
            type: Number,
            min: [1, 'Maximum length must be at least 1']
        },
        minValue: {
            type: Number
        },
        maxValue: {
            type: Number
        },
        regexPattern: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    try {
                        new RegExp(v);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                message: 'Invalid regex pattern'
            }
        },
        regexFlags: {
            type: String,
            trim: true,
            maxlength: [10, 'Regex flags cannot exceed 10 characters']
        },
        allowedValues: [{
            value: mongoose.Schema.Types.Mixed,
            label: String,
            description: String,
            isDefault: {
                type: Boolean,
                default: false
            }
        }],
        customValidation: {
            functionName: String,
            parameters: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            errorMessage: String
        },
        dependsOn: [{
            configKey: {
                type: String,
                required: true
            },
            condition: {
                type: String,
                enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'regex'],
                required: true
            },
            value: mongoose.Schema.Types.Mixed,
            action: {
                type: String,
                enum: ['require', 'hide', 'disable', 'validate'],
                required: true
            }
        }]
    },

    // ** CATEGORIZATION & ORGANIZATION **
    categoryInfo: {
        category: {
            type: String,
            enum: [
                'SYSTEM', 'SECURITY', 'PERFORMANCE', 'INTEGRATION', 'WORKFLOW',
                'NOTIFICATION', 'DATABASE', 'CACHE', 'API', 'UI', 'BUSINESS',
                'COMPLIANCE', 'AUDIT', 'REPORTING', 'MONITORING', 'BACKUP'
            ],
            required: [true, 'Category is required'],
            index: true
        },
        subCategory: {
            type: String,
            trim: true,
            maxlength: [50, 'Sub-category cannot exceed 50 characters']
        },
        module: {
            type: String,
            enum: [
                'Core', 'Claims', 'Patients', 'Clients', 'Employees', 'Reports',
                'Integration', 'Security', 'Performance', 'Notifications', 'Audit'
            ],
            index: true
        },
        feature: {
            type: String,
            trim: true,
            maxlength: [100, 'Feature cannot exceed 100 characters']
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High', 'Critical'],
            default: 'Normal',
            index: true
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }]
    },

    // ** ENVIRONMENT & SCOPE **
    environmentInfo: {
        environment: {
            type: String,
            enum: ['Development', 'Testing', 'Staging', 'Production', 'All'],
            default: 'All',
            index: true
        },
        scope: {
            type: String,
            enum: ['Global', 'Company', 'Department', 'Role', 'User', 'Session'],
            default: 'Global',
            index: true
        },
        companyRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            sparse: true,
            index: true
        },
        departmentRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            sparse: true
        },
        roleRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            sparse: true
        },
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            sparse: true
        },
        inheritanceLevel: {
            type: Number,
            default: 0,
            min: [0, 'Inheritance level cannot be negative'],
            max: [10, 'Inheritance level cannot exceed 10']
        },
        overrideAllowed: {
            type: Boolean,
            default: true
        },
        propagateChanges: {
            type: Boolean,
            default: true
        }
    },

    // ** ACCESS CONTROL **
    accessControl: {
        isEditable: {
            type: Boolean,
            default: true,
            index: true
        },
        isVisible: {
            type: Boolean,
            default: true,
            index: true
        },
        isSystemManaged: {
            type: Boolean,
            default: false,
            index: true
        },
        requiredPermissions: [{
            permission: {
                type: String,
                enum: ['READ', 'WRITE', 'DELETE', 'ADMIN'],
                required: true
            },
            resource: {
                type: String,
                required: true
            },
            condition: String
        }],
        allowedRoles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }],
        restrictedRoles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }],
        allowedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }],
        ipWhitelist: [{
            type: String,
            validate: {
                validator: function (v) {
                    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/\d{1,2})?$/.test(v);
                },
                message: 'Invalid IP address or CIDR format'
            }
        }],
        timeRestrictions: {
            allowedHours: {
                start: {
                    type: String,
                    validate: {
                        validator: function (v) {
                            return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                        },
                        message: 'Invalid time format (HH:MM)'
                    }
                },
                end: {
                    type: String,
                    validate: {
                        validator: function (v) {
                            return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                        },
                        message: 'Invalid time format (HH:MM)'
                    }
                }
            },
            allowedDays: [{
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }],
            timezone: {
                type: String,
                default: 'UTC'
            }
        }
    },

    // ** CHANGE MANAGEMENT **
    changeManagement: {
        requiresApproval: {
            type: Boolean,
            default: false,
            index: true
        },
        approvalWorkflow: [{
            level: {
                type: Number,
                required: true,
                min: [1, 'Approval level must be at least 1']
            },
            approverType: {
                type: String,
                enum: ['Role', 'User', 'Department', 'System'],
                required: true
            },
            approverRef: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'changeManagement.approvalWorkflow.approverType'
            },
            isRequired: {
                type: Boolean,
                default: true
            },
            timeout: {
                type: Number, // hours
                default: 72
            }
        }],
        changeRequests: [{
            requestId: {
                type: String,
                default: () => `CHG-${uuidv4().substring(0, 8)}`
            },
            requestedValue: mongoose.Schema.Types.Mixed,
            requestedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            requestedAt: {
                type: Date,
                default: Date.now
            },
            reason: {
                type: String,
                required: true,
                maxlength: [1000, 'Reason cannot exceed 1000 characters']
            },
            businessJustification: {
                type: String,
                maxlength: [2000, 'Business justification cannot exceed 2000 characters']
            },
            status: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired'],
                default: 'Pending'
            },
            approvals: [{
                level: Number,
                approver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Employee'
                },
                decision: {
                    type: String,
                    enum: ['Approved', 'Rejected']
                },
                comments: String,
                decidedAt: Date
            }],
            implementedAt: Date,
            implementedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        lastChangeRequest: {
            type: mongoose.Schema.Types.ObjectId
        },
        changeFrequency: {
            type: String,
            enum: ['Never', 'Rarely', 'Monthly', 'Weekly', 'Daily', 'Real-time'],
            default: 'Rarely'
        }
    },

    // ** MONITORING & ALERTS **
    monitoringInfo: {
        isMonitored: {
            type: Boolean,
            default: false,
            index: true
        },
        monitoringLevel: {
            type: String,
            enum: ['None', 'Basic', 'Standard', 'Advanced', 'Critical'],
            default: 'None'
        },
        alertThresholds: [{
            metric: {
                type: String,
                enum: ['change_frequency', 'value_range', 'access_frequency', 'performance_impact'],
                required: true
            },
            operator: {
                type: String,
                enum: ['greater_than', 'less_than', 'equals', 'not_equals', 'between'],
                required: true
            },
            value: mongoose.Schema.Types.Mixed,
            severity: {
                type: String,
                enum: ['Low', 'Medium', 'High', 'Critical'],
                default: 'Medium'
            },
            action: {
                type: String,
                enum: ['Log', 'Alert', 'Block', 'Revert'],
                default: 'Alert'
            }
        }],
        performanceImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            default: 'None'
        },
        lastAccessed: {
            type: Date,
            index: true
        },
        accessCount: {
            type: Number,
            default: 0
        },
        lastModified: {
            type: Date,
            index: true
        },
        modificationCount: {
            type: Number,
            default: 0
        },
        healthStatus: {
            type: String,
            enum: ['Healthy', 'Warning', 'Error', 'Critical', 'Unknown'],
            default: 'Healthy',
            index: true
        },
        healthCheckInterval: {
            type: Number, // minutes
            default: 60
        }
    },

    // ** INTEGRATION & DEPENDENCIES **
    integrationInfo: {
        dependentConfigs: [{
            configKey: {
                type: String,
                required: true
            },
            dependencyType: {
                type: String,
                enum: ['Required', 'Optional', 'Conflict', 'Exclusive'],
                required: true
            },
            description: String
        }],
        affectedSystems: [{
            systemName: {
                type: String,
                required: true
            },
            systemType: {
                type: String,
                enum: ['Internal', 'External', 'Integration', 'Database', 'Cache', 'Queue'],
                required: true
            },
            impactLevel: {
                type: String,
                enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
                default: 'Low'
            },
            restartRequired: {
                type: Boolean,
                default: false
            },
            cacheClearRequired: {
                type: Boolean,
                default: false
            }
        }],
        externalReferences: [{
            system: String,
            reference: String,
            description: String,
            isActive: {
                type: Boolean,
                default: true
            }
        }],
        apiEndpoints: [{
            endpoint: String,
            method: String,
            affectedBy: Boolean,
            affects: Boolean
        }]
    },

    // ** COMPLIANCE & GOVERNANCE **
    complianceInfo: {
        regulatoryFrameworks: [{
            framework: {
                type: String,
                enum: ['HIPAA', 'SOX', 'GDPR', 'PCI_DSS', 'SOC2', 'FDA', 'FISMA'],
                required: true
            },
            requirement: String,
            complianceLevel: {
                type: String,
                enum: ['Not_Applicable', 'Compliant', 'Partial', 'Non_Compliant'],
                default: 'Not_Applicable'
            },
            evidence: String,
            assessor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            lastAssessed: Date,
            nextAssessment: Date
        }],
        dataClassification: {
            type: String,
            enum: ['Public', 'Internal', 'Confidential', 'Restricted', 'PHI', 'PII'],
            default: 'Internal'
        },
        retentionPeriod: {
            type: Number, // days
            default: 2555 // 7 years
        },
        backupRequired: {
            type: Boolean,
            default: true
        },
        auditTrailRequired: {
            type: Boolean,
            default: true
        },
        encryptionRequired: {
            type: Boolean,
            default: false
        }
    },

    // ** DEPLOYMENT INFO **
    deploymentInfo: {
        version: {
            type: String,
            default: '1.0.0',
            validate: {
                validator: function (v) {
                    return /^\d+\.\d+\.\d+$/.test(v);
                },
                message: 'Version must follow semantic versioning (x.y.z)'
            }
        },
        releaseNotes: [{
            version: String,
            changes: [String],
            releasedAt: Date,
            releasedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        deployment: {
            status: {
                type: String,
                enum: ['Draft', 'Testing', 'Staging', 'Production', 'Deprecated'],
                default: 'Draft',
                index: true
            },
            deployedAt: Date,
            deployedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            rollbackPlan: String,
            testingResults: [{
                test: String,
                result: {
                    type: String,
                    enum: ['Pass', 'Fail', 'Skip']
                },
                notes: String,
                testedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Employee'
                },
                testedAt: Date
            }]
        },
        lifecycle: {
            status: {
                type: String,
                enum: ['Active', 'Deprecated', 'Obsolete', 'Archived'],
                default: 'Active',
                index: true
            },
            deprecationDate: Date,
            replacementConfig: String,
            migrationInstructions: String
        }
    },

    // ** SYSTEM INFO **
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isSystemDefault: {
            type: Boolean,
            default: false,
            index: true
        },
        canDelete: {
            type: Boolean,
            default: true
        },
        canDisable: {
            type: Boolean,
            default: true
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
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
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
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedAt: Date,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastReviewedAt: Date,
        nextReviewDate: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** COMPREHENSIVE INDEXES **
systemConfigSchema.index({ 'configInfo.configKey': 1 }, { unique: true });
systemConfigSchema.index({ 'categoryInfo.category': 1, 'categoryInfo.module': 1 });
systemConfigSchema.index({ 'environmentInfo.environment': 1, 'environmentInfo.scope': 1 });
systemConfigSchema.index({ 'accessControl.isEditable': 1, 'systemInfo.isActive': 1 });
systemConfigSchema.index({ 'monitoringInfo.isMonitored': 1, 'monitoringInfo.healthStatus': 1 });
systemConfigSchema.index({ 'deploymentInfo.deployment.status': 1 });
systemConfigSchema.index({ 'complianceInfo.regulatoryFrameworks.framework': 1 });

// Compound indexes
systemConfigSchema.index({
    'environmentInfo.companyRef': 1,
    'categoryInfo.category': 1,
    'systemInfo.isActive': 1
});

// ** VIRTUAL FIELDS **
systemConfigSchema.virtual('isSecure').get(function () {
    return this.configValue.isEncrypted ||
        this.complianceInfo.encryptionRequired ||
        this.complianceInfo.dataClassification === 'Restricted';
});

systemConfigSchema.virtual('hasValidValue').get(function () {
    return this.validateCurrentValue().isValid;
});

systemConfigSchema.virtual('requiresReview').get(function () {
    if (!this.auditInfo.nextReviewDate) return false;
    return new Date() > this.auditInfo.nextReviewDate;
});

systemConfigSchema.virtual('changesPending').get(function () {
    return this.changeManagement.changeRequests.some(req => req.status === 'Pending');
});

systemConfigSchema.virtual('displayValue').get(function () {
    if (this.configValue.isEncrypted) {
        return '***ENCRYPTED***';
    }

    if (this.configInfo.configType === 'OBJECT' || this.configInfo.configType === 'ARRAY') {
        return JSON.stringify(this.configValue.currentValue);
    }

    return String(this.configValue.currentValue);
});

// ** INSTANCE METHODS **
systemConfigSchema.methods.validateCurrentValue = function () {
    const value = this.configValue.currentValue;
    const rules = this.validationRules;
    const errors = [];

    // Required check
    if (rules.isRequired && (value === null || value === undefined)) {
        errors.push('Value is required');
    }

    // Null/Empty checks
    if (!rules.allowNull && value === null) {
        errors.push('Null values not allowed');
    }

    if (!rules.allowEmpty && value === '') {
        errors.push('Empty values not allowed');
    }

    // Type-specific validations
    if (value !== null && value !== undefined) {
        switch (this.configInfo.configType) {
            case 'STRING':
                if (typeof value !== 'string') {
                    errors.push('Value must be a string');
                } else {
                    if (rules.minLength && value.length < rules.minLength) {
                        errors.push(`Minimum length is ${rules.minLength}`);
                    }
                    if (rules.maxLength && value.length > rules.maxLength) {
                        errors.push(`Maximum length is ${rules.maxLength}`);
                    }
                    if (rules.regexPattern) {
                        const regex = new RegExp(rules.regexPattern, rules.regexFlags || '');
                        if (!regex.test(value)) {
                            errors.push('Value does not match required pattern');
                        }
                    }
                }
                break;

            case 'NUMBER':
                if (typeof value !== 'number') {
                    errors.push('Value must be a number');
                } else {
                    if (rules.minValue !== undefined && value < rules.minValue) {
                        errors.push(`Minimum value is ${rules.minValue}`);
                    }
                    if (rules.maxValue !== undefined && value > rules.maxValue) {
                        errors.push(`Maximum value is ${rules.maxValue}`);
                    }
                }
                break;

            case 'BOOLEAN':
                if (typeof value !== 'boolean') {
                    errors.push('Value must be a boolean');
                }
                break;

            case 'EMAIL':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push('Invalid email format');
                }
                break;

            case 'URL':
                try {
                    new URL(value);
                } catch (e) {
                    errors.push('Invalid URL format');
                }
                break;
        }

        // Allowed values check
        if (rules.allowedValues.length > 0) {
            const allowedValues = rules.allowedValues.map(av => av.value);
            if (!allowedValues.includes(value)) {
                errors.push('Value not in allowed list');
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

systemConfigSchema.methods.setValue = function (newValue, changedBy, reason = '', requireApproval = null) {
    const validation = this.validateCurrentValue.call({ ...this.toObject(), configValue: { ...this.configValue, currentValue: newValue } });

    if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if approval is required
    const needsApproval = requireApproval !== null ? requireApproval : this.changeManagement.requiresApproval;

    if (needsApproval && changedBy) {
        // Create change request
        const changeRequest = {
            requestedValue: newValue,
            requestedBy: changedBy,
            requestedAt: new Date(),
            reason: reason,
            status: 'Pending'
        };

        this.changeManagement.changeRequests.push(changeRequest);
        this.changeManagement.lastChangeRequest = changeRequest._id;

        return { status: 'pending_approval', changeRequestId: changeRequest._id };
    } else {
        // Direct update
        this.updateValue(newValue, changedBy, reason);
        return { status: 'updated', value: newValue };
    }
};

systemConfigSchema.methods.updateValue = function (newValue, changedBy, reason = '') {
    // Store previous value
    const previousValue = {
        value: this.configValue.currentValue,
        changedAt: new Date(),
        changedBy: changedBy,
        changeReason: reason,
        version: this.configValue.previousValues.length + 1
    };

    this.configValue.previousValues.push(previousValue);

    // Encrypt if needed
    if (this.configValue.isEncrypted) {
        this.configValue.encryptedValue = this.encryptValue(newValue);
        this.configValue.currentValue = null; // Clear plaintext
    } else {
        this.configValue.currentValue = newValue;
        this.configValue.encryptedValue = null;
    }

    // Update audit info
    this.auditInfo.lastModifiedBy = changedBy;
    this.auditInfo.lastModifiedAt = new Date();

    // Update monitoring
    this.monitoringInfo.lastModified = new Date();
    this.monitoringInfo.modificationCount++;

    // Cleanup old history if needed
    if (this.configValue.previousValues.length > this.configValue.valueHistory.maxHistorySize) {
        this.configValue.previousValues = this.configValue.previousValues.slice(-this.configValue.valueHistory.maxHistorySize);
    }
};

systemConfigSchema.methods.encryptValue = function (value) {
    if (this.configValue.encryptionMethod === 'AES256') {
        const cipher = crypto.createCipher('aes256', process.env.CONFIG_ENCRYPTION_KEY || 'default-key');
        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    return value;
};

systemConfigSchema.methods.decryptValue = function () {
    if (!this.configValue.isEncrypted || !this.configValue.encryptedValue) {
        return this.configValue.currentValue;
    }

    if (this.configValue.encryptionMethod === 'AES256') {
        const decipher = crypto.createDecipher('aes256', process.env.CONFIG_ENCRYPTION_KEY || 'default-key');
        let decrypted = decipher.update(this.configValue.encryptedValue, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    return this.configValue.encryptedValue;
};

systemConfigSchema.methods.lock = function (lockedBy, reason = '') {
    this.systemInfo.isLocked = true;
    this.systemInfo.lockedBy = lockedBy;
    this.systemInfo.lockedAt = new Date();
    this.systemInfo.lockReason = reason;
};

systemConfigSchema.methods.unlock = function (unlockedBy) {
    // Only the locker or admin can unlock
    if (this.systemInfo.lockedBy && !this.systemInfo.lockedBy.equals(unlockedBy)) {
        // Check if unlocker is admin - would need role checking logic here
        throw new Error('Only the person who locked this configuration can unlock it');
    }

    this.systemInfo.isLocked = false;
    this.systemInfo.lockedBy = null;
    this.systemInfo.lockedAt = null;
    this.systemInfo.lockReason = null;
};

systemConfigSchema.methods.approveChangeRequest = function (requestId, approver, decision, comments = '') {
    const request = this.changeManagement.changeRequests.id(requestId);
    if (!request) {
        throw new Error('Change request not found');
    }

    if (request.status !== 'Pending') {
        throw new Error('Change request is not pending');
    }

    // Find required approval level
    const workflow = this.changeManagement.approvalWorkflow;
    const nextLevel = request.approvals.length + 1;
    const levelConfig = workflow.find(w => w.level === nextLevel);

    if (!levelConfig) {
        throw new Error('No approval workflow configured for this level');
    }

    // Add approval
    request.approvals.push({
        level: nextLevel,
        approver: approver,
        decision: decision,
        comments: comments,
        decidedAt: new Date()
    });

    if (decision === 'Rejected') {
        request.status = 'Rejected';
    } else if (nextLevel >= workflow.length) {
        // All approvals received
        request.status = 'Approved';
        request.implementedAt = new Date();
        request.implementedBy = approver;

        // Apply the change
        this.updateValue(request.requestedValue, request.requestedBy, request.reason);
    }

    return request;
};

// ** STATIC METHODS **
systemConfigSchema.statics.findByCategory = function (category, module = null, environment = 'All') {
    const query = {
        'categoryInfo.category': category,
        'environmentInfo.environment': { $in: [environment, 'All'] },
        'systemInfo.isActive': true
    };

    if (module) {
        query['categoryInfo.module'] = module;
    }

    return this.find(query).sort({ 'configInfo.configKey': 1 });
};

systemConfigSchema.statics.findByScope = function (scope, scopeRef = null) {
    const query = {
        'environmentInfo.scope': scope,
        'systemInfo.isActive': true
    };

    if (scopeRef) {
        switch (scope) {
            case 'Company':
                query['environmentInfo.companyRef'] = scopeRef;
                break;
            case 'Department':
                query['environmentInfo.departmentRef'] = scopeRef;
                break;
            case 'Role':
                query['environmentInfo.roleRef'] = scopeRef;
                break;
            case 'User':
                query['environmentInfo.userRef'] = scopeRef;
                break;
        }
    }

    return this.find(query).sort({ 'configInfo.configKey': 1 });
};

systemConfigSchema.statics.getEffectiveValue = function (configKey, context = {}) {
    // Get all configs with this key, ordered by scope priority
    const scopePriority = ['User', 'Role', 'Department', 'Company', 'Global'];

    return this.aggregate([
        {
            $match: {
                'configInfo.configKey': configKey,
                'systemInfo.isActive': true
            }
        },
        {
            $addFields: {
                scopePriority: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$environmentInfo.scope', 'User'] }, then: 0 },
                            { case: { $eq: ['$environmentInfo.scope', 'Role'] }, then: 1 },
                            { case: { $eq: ['$environmentInfo.scope', 'Department'] }, then: 2 },
                            { case: { $eq: ['$environmentInfo.scope', 'Company'] }, then: 3 },
                            { case: { $eq: ['$environmentInfo.scope', 'Global'] }, then: 4 }
                        ],
                        default: 5
                    }
                }
            }
        },
        { $sort: { scopePriority: 1 } },
        { $limit: 1 }
    ]);
};

systemConfigSchema.statics.findRequiringReview = function () {
    return this.find({
        'auditInfo.nextReviewDate': { $lte: new Date() },
        'systemInfo.isActive': true
    }).sort({ 'auditInfo.nextReviewDate': 1 });
};

systemConfigSchema.statics.findPendingApprovals = function (approver = null) {
    const query = {
        'changeManagement.changeRequests.status': 'Pending',
        'systemInfo.isActive': true
    };

    if (approver) {
        query['changeManagement.approvalWorkflow.approverRef'] = approver;
    }

    return this.find(query).sort({ 'changeManagement.changeRequests.requestedAt': 1 });
};

// ** PRE-SAVE MIDDLEWARE **
systemConfigSchema.pre('save', function (next) {
    // Validate current value
    const validation = this.validateCurrentValue();
    if (!validation.isValid) {
        return next(new Error(`Configuration validation failed: ${validation.errors.join(', ')}`));
    }

    // Set audit info
    if (this.isModified() && !this.isNew) {
        this.auditInfo.lastModifiedAt = new Date();
    }

    // Update monitoring
    if (this.isModified('configValue.currentValue')) {
        this.monitoringInfo.lastModified = new Date();
        this.monitoringInfo.modificationCount++;
    }

    // Set next review date if not set
    if (!this.auditInfo.nextReviewDate) {
        const reviewInterval = this.categoryInfo.priority === 'Critical' ? 90 : 365; // days
        this.auditInfo.nextReviewDate = new Date(Date.now() + (reviewInterval * 24 * 60 * 60 * 1000));
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
systemConfigSchema.post('save', function (doc) {
    // Clear cache for affected systems
    if (doc.integrationInfo.affectedSystems.length > 0) {
        // This would trigger cache clearing logic
        console.log(`Configuration ${doc.configInfo.configKey} changed - clearing cache for affected systems`);
    }

    // Send notifications if monitoring is enabled
    if (doc.monitoringInfo.isMonitored && doc.monitoringInfo.alertThresholds.length > 0) {
        // This would trigger monitoring alerts
        console.log(`Configuration ${doc.configInfo.configKey} changed - checking alert thresholds`);
    }
});

export const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema, 'systemconfigs');