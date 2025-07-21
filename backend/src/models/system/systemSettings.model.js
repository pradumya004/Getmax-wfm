// backend/src/models/system/systemSettings.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import plugin from '../../plugins/scopedIdPlugin.js';

const systemSettingsSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    settingsId: {
        type: String,
        unique: true,
        // default: () => `SET-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // ** MAIN RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        unique: true, // Each company has one settings document
        index: true
    },

    // ** GENERAL SYSTEM SETTINGS **
    general: {
        systemName: {
            type: String,
            default: 'GetMax WFM',
            trim: true
        },
        timeZone: {
            type: String,
            default: 'UTC',
            enum: [
                'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
                'America/Toronto', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
                'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland'
            ]
        },
        dateFormat: {
            type: String,
            default: 'MM/DD/YYYY',
            enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY']
        },
        timeFormat: {
            type: String,
            default: '12-hour',
            enum: ['12-hour', '24-hour']
        },
        currency: {
            code: {
                type: String,
                default: 'USD',
                enum: ['USD', 'EUR', 'GBP', 'CAD', 'INR', 'AUD', 'JPY']
            },
            symbol: {
                type: String,
                default: '$'
            },
            decimalPlaces: {
                type: Number,
                default: 2,
                min: [0, 'Decimal places cannot be negative'],
                max: [4, 'Maximum 4 decimal places allowed']
            }
        },
        language: {
            primary: {
                type: String,
                default: 'en',
                enum: ['en', 'es', 'fr', 'de', 'pt', 'it', 'hi']
            },
            supported: [{
                type: String,
                enum: ['en', 'es', 'fr', 'de', 'pt', 'it', 'hi']
            }]
        },
        businessHours: {
            workDays: [{
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }],
            startTime: {
                type: String,
                default: '09:00',
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
            },
            endTime: {
                type: String,
                default: '17:00',
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
            },
            lunchBreak: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                startTime: {
                    type: String,
                    default: '12:00'
                },
                duration: {
                    type: Number,
                    default: 60, // minutes
                    min: [15, 'Minimum lunch break is 15 minutes'],
                    max: [120, 'Maximum lunch break is 2 hours']
                }
            }
        }
    },

    // ** RCM WORKFLOW SETTINGS **
    rcmWorkflow: {
        defaultSlaHours: {
            claimsProcessing: {
                type: Number,
                default: 24,
                min: [1, 'Minimum SLA is 1 hour']
            },
            denialManagement: {
                type: Number,
                default: 48,
                min: [1, 'Minimum SLA is 1 hour']
            },
            priorAuthorization: {
                type: Number,
                default: 72,
                min: [1, 'Minimum SLA is 1 hour']
            },
            arCalling: {
                type: Number,
                default: 48,
                min: [1, 'Minimum SLA is 1 hour']
            },
            paymentPosting: {
                type: Number,
                default: 24,
                min: [1, 'Minimum SLA is 1 hour']
            },
            patientRegistration: {
                type: Number,
                default: 4,
                min: [1, 'Minimum SLA is 1 hour']
            }
        },
        autoAssignment: {
            enabled: {
                type: Boolean,
                default: true
            },
            assignmentMethod: {
                type: String,
                default: 'Round Robin',
                enum: ['Round Robin', 'Load Based', 'Skill Based', 'Random', 'Manual']
            },
            considerWorkload: {
                type: Boolean,
                default: true
            },
            considerSkills: {
                type: Boolean,
                default: true
            },
            maxClaimsPerUser: {
                type: Number,
                default: 100,
                min: [1, 'Minimum 1 claim per user'],
                max: [1000, 'Maximum 1000 claims per user']
            }
        },
        escalationRules: {
            slaBreachEscalation: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                warningThreshold: {
                    type: Number,
                    default: 80, // percentage of SLA time
                    min: [50, 'Minimum warning threshold is 50%'],
                    max: [95, 'Maximum warning threshold is 95%']
                },
                escalationLevels: [{
                    level: {
                        type: Number,
                        required: true,
                        min: [1, 'Level must be at least 1']
                    },
                    roleRef: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Role'
                    },
                    delayMinutes: {
                        type: Number,
                        default: 60,
                        min: [15, 'Minimum delay is 15 minutes']
                    }
                }]
            },
            qualityEscalation: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                failureThreshold: {
                    type: Number,
                    default: 2, // consecutive failures
                    min: [1, 'Minimum threshold is 1 failure']
                }
            }
        },
        stageTransitions: {
            autoAdvanceEnabled: {
                type: Boolean,
                default: false
            },
            requireApproval: [{
                stage: {
                    type: String,
                    enum: ['Registration', 'Eligibility', 'Authorization', 'Coding', 'Scrubbing', 'Submission', 'Follow-up', 'Payment', 'Closure']
                },
                approvalRequired: {
                    type: Boolean,
                    default: false
                },
                approverRole: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Role'
                }
            }]
        }
    },

    // ** QA SYSTEM SETTINGS **
    qaSettings: {
        samplingRules: {
            defaultSamplingRate: {
                type: Number,
                default: 10, // percentage
                min: [1, 'Minimum sampling rate is 1%'],
                max: [100, 'Maximum sampling rate is 100%']
            },
            newEmployeeSamplingRate: {
                type: Number,
                default: 25, // percentage for first 90 days
                min: [1, 'Minimum sampling rate is 1%'],
                max: [100, 'Maximum sampling rate is 100%']
            },
            errorBasedSampling: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                multiplier: {
                    type: Number,
                    default: 2, // increase rate by 2x if errors found
                    min: [1, 'Multiplier must be at least 1']
                }
            },
            serviceLevelSampling: {
                arCalling: {
                    type: Number,
                    default: 10
                },
                medicalCoding: {
                    type: Number,
                    default: 15
                },
                denialManagement: {
                    type: Number,
                    default: 20
                },
                priorAuth: {
                    type: Number,
                    default: 25
                }
            }
        },
        scoringSystem: {
            passingScore: {
                type: Number,
                default: 85,
                min: [70, 'Minimum passing score is 70%'],
                max: [100, 'Maximum score is 100%']
            },
            errorWeights: {
                critical: {
                    type: Number,
                    default: 25, // points deducted
                    min: [10, 'Minimum weight is 10 points']
                },
                major: {
                    type: Number,
                    default: 15,
                    min: [5, 'Minimum weight is 5 points']
                },
                minor: {
                    type: Number,
                    default: 5,
                    min: [1, 'Minimum weight is 1 point']
                }
            },
            rebuttalProcess: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                timeLimit: {
                    type: Number,
                    default: 72, // hours
                    min: [24, 'Minimum rebuttal time is 24 hours']
                },
                reviewerRole: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Role'
                }
            }
        },
        calibration: {
            enabled: {
                type: Boolean,
                default: true
            },
            frequency: {
                type: String,
                default: 'Monthly',
                enum: ['Weekly', 'Biweekly', 'Monthly', 'Quarterly']
            },
            varianceThreshold: {
                type: Number,
                default: 5, // percentage variance allowed between reviewers
                min: [1, 'Minimum variance threshold is 1%'],
                max: [15, 'Maximum variance threshold is 15%']
            }
        }
    },

    // ** SLA MANAGEMENT SETTINGS **
    slaSettings: {
        monitoring: {
            realTimeTracking: {
                type: Boolean,
                default: true
            },
            alertThresholds: {
                yellow: {
                    type: Number,
                    default: 80, // percentage of SLA time consumed
                    min: [50, 'Minimum threshold is 50%'],
                    max: [95, 'Maximum threshold is 95%']
                },
                red: {
                    type: Number,
                    default: 95,
                    min: [80, 'Minimum threshold is 80%'],
                    max: [99, 'Maximum threshold is 99%']
                }
            },
            pauseReasons: [{
                reason: {
                    type: String,
                    required: true,
                    trim: true
                },
                requiresApproval: {
                    type: Boolean,
                    default: false
                },
                maxDuration: {
                    type: Number, // hours
                    default: 24
                }
            }],
            businessHoursOnly: {
                type: Boolean,
                default: true
            },
            excludeWeekends: {
                type: Boolean,
                default: true
            },
            excludeHolidays: {
                type: Boolean,
                default: true
            }
        },
        reporting: {
            dashboardRefreshInterval: {
                type: Number,
                default: 5, // minutes
                min: [1, 'Minimum interval is 1 minute'],
                max: [60, 'Maximum interval is 60 minutes']
            },
            historicalRetention: {
                type: Number,
                default: 24, // months
                min: [12, 'Minimum retention is 12 months'],
                max: [60, 'Maximum retention is 60 months']
            }
        }
    },

    // ** NOTIFICATION SETTINGS **
    notifications: {
        channels: {
            email: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                smtpConfig: {
                    host: String,
                    port: {
                        type: Number,
                        default: 587
                    },
                    username: String,
                    password: String, // Encrypted
                    secure: {
                        type: Boolean,
                        default: true
                    }
                },
                fromEmail: {
                    type: String,
                    trim: true
                },
                fromName: {
                    type: String,
                    default: 'GetMax WFM',
                    trim: true
                }
            },
            sms: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                provider: {
                    type: String,
                    enum: ['Twilio', 'AWS_SNS', 'MessageBird', 'Nexmo']
                },
                apiKey: String, // Encrypted
                fromNumber: String
            },
            inApp: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                retentionDays: {
                    type: Number,
                    default: 30,
                    min: [7, 'Minimum retention is 7 days'],
                    max: [365, 'Maximum retention is 365 days']
                }
            },
            teams: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                webhookUrl: String
            },
            slack: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                webhookUrl: String,
                botToken: String // Encrypted
            }
        },
        preferences: {
            quietHours: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                startTime: {
                    type: String,
                    default: '18:00'
                },
                endTime: {
                    type: String,
                    default: '08:00'
                },
                weekendsOnly: {
                    type: Boolean,
                    default: false
                }
            },
            escalationNotifications: {
                immediate: {
                    type: Boolean,
                    default: true
                },
                digest: {
                    enabled: {
                        type: Boolean,
                        default: true
                    },
                    frequency: {
                        type: String,
                        default: 'Daily',
                        enum: ['Hourly', 'Daily', 'Weekly']
                    },
                    sendTime: {
                        type: String,
                        default: '08:00'
                    }
                }
            }
        }
    },

    // ** SECURITY SETTINGS **
    security: {
        authentication: {
            passwordPolicy: {
                minLength: {
                    type: Number,
                    default: 8,
                    min: [6, 'Minimum password length is 6 characters'],
                    max: [50, 'Maximum password length is 50 characters']
                },
                requireUppercase: {
                    type: Boolean,
                    default: true
                },
                requireLowercase: {
                    type: Boolean,
                    default: true
                },
                requireNumbers: {
                    type: Boolean,
                    default: true
                },
                requireSpecialChars: {
                    type: Boolean,
                    default: true
                },
                expirationDays: {
                    type: Number,
                    default: 90,
                    min: [30, 'Minimum expiration is 30 days'],
                    max: [365, 'Maximum expiration is 365 days']
                },
                preventReuse: {
                    type: Number,
                    default: 5, // last 5 passwords
                    min: [3, 'Minimum prevent reuse is 3'],
                    max: [12, 'Maximum prevent reuse is 12']
                }
            },
            sessionManagement: {
                timeoutMinutes: {
                    type: Number,
                    default: 60,
                    min: [15, 'Minimum timeout is 15 minutes'],
                    max: [480, 'Maximum timeout is 8 hours']
                },
                maxConcurrentSessions: {
                    type: Number,
                    default: 3,
                    min: [1, 'Minimum concurrent sessions is 1'],
                    max: [10, 'Maximum concurrent sessions is 10']
                },
                rememberMeDays: {
                    type: Number,
                    default: 30,
                    min: [1, 'Minimum remember me is 1 day'],
                    max: [90, 'Maximum remember me is 90 days']
                }
            },
            mfa: {
                required: {
                    type: Boolean,
                    default: false
                },
                methods: [{
                    type: String,
                    enum: ['SMS', 'Email', 'Authenticator', 'Hardware_Token']
                }],
                gracePeriodDays: {
                    type: Number,
                    default: 7,
                    min: [0, 'Minimum grace period is 0 days'],
                    max: [30, 'Maximum grace period is 30 days']
                }
            }
        },
        authorization: {
            permissionCaching: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                ttlMinutes: {
                    type: Number,
                    default: 30,
                    min: [5, 'Minimum TTL is 5 minutes'],
                    max: [120, 'Maximum TTL is 120 minutes']
                }
            },
            dataAccess: {
                logAllAccess: {
                    type: Boolean,
                    default: true
                },
                requireJustification: {
                    type: Boolean,
                    default: false
                },
                maskSensitiveData: {
                    type: Boolean,
                    default: true
                }
            }
        },
        dataProtection: {
            encryption: {
                atRest: {
                    type: Boolean,
                    default: true
                },
                inTransit: {
                    type: Boolean,
                    default: true
                },
                keyRotationDays: {
                    type: Number,
                    default: 90,
                    min: [30, 'Minimum key rotation is 30 days'],
                    max: [365, 'Maximum key rotation is 365 days']
                }
            },
            backup: {
                frequency: {
                    type: String,
                    default: 'Daily',
                    enum: ['Hourly', 'Daily', 'Weekly']
                },
                retentionDays: {
                    type: Number,
                    default: 90,
                    min: [7, 'Minimum backup retention is 7 days'],
                    max: [2555, 'Maximum backup retention is 7 years']
                },
                encryption: {
                    type: Boolean,
                    default: true
                }
            }
        }
    },

    // ** INTEGRATION SETTINGS **
    integrations: {
        edi: {
            defaultClearinghouse: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Clearinghouse'
            },
            batchProcessing: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                batchSize: {
                    type: Number,
                    default: 100,
                    min: [10, 'Minimum batch size is 10'],
                    max: [1000, 'Maximum batch size is 1000']
                },
                scheduleInterval: {
                    type: Number,
                    default: 60, // minutes
                    min: [15, 'Minimum interval is 15 minutes'],
                    max: [1440, 'Maximum interval is 24 hours']
                }
            },
            validationRules: {
                strictMode: {
                    type: Boolean,
                    default: true
                },
                skipInvalidClaims: {
                    type: Boolean,
                    default: false
                },
                notifyOnErrors: {
                    type: Boolean,
                    default: true
                }
            }
        },
        api: {
            rateLimiting: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                requestsPerMinute: {
                    type: Number,
                    default: 1000,
                    min: [100, 'Minimum rate limit is 100 requests/minute'],
                    max: [10000, 'Maximum rate limit is 10000 requests/minute']
                },
                burstLimit: {
                    type: Number,
                    default: 100,
                    min: [10, 'Minimum burst limit is 10'],
                    max: [500, 'Maximum burst limit is 500']
                }
            },
            logging: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                retentionDays: {
                    type: Number,
                    default: 30,
                    min: [7, 'Minimum retention is 7 days'],
                    max: [365, 'Maximum retention is 365 days']
                },
                includeSensitiveData: {
                    type: Boolean,
                    default: false
                }
            }
        }
    },

    // ** PERFORMANCE SETTINGS **
    performance: {
        database: {
            connectionPoolSize: {
                type: Number,
                default: 10,
                min: [5, 'Minimum pool size is 5'],
                max: [50, 'Maximum pool size is 50']
            },
            queryTimeout: {
                type: Number,
                default: 30, // seconds
                min: [10, 'Minimum timeout is 10 seconds'],
                max: [300, 'Maximum timeout is 300 seconds']
            },
            indexOptimization: {
                type: Boolean,
                default: true
            }
        },
        caching: {
            enabled: {
                type: Boolean,
                default: true
            },
            provider: {
                type: String,
                default: 'Redis',
                enum: ['Memory', 'Redis', 'Memcached']
            },
            defaultTtl: {
                type: Number,
                default: 3600, // seconds
                min: [60, 'Minimum TTL is 60 seconds'],
                max: [86400, 'Maximum TTL is 24 hours']
            }
        },
        monitoring: {
            enabled: {
                type: Boolean,
                default: true
            },
            alertThresholds: {
                cpuUsage: {
                    type: Number,
                    default: 80, // percentage
                    min: [50, 'Minimum threshold is 50%'],
                    max: [95, 'Maximum threshold is 95%']
                },
                memoryUsage: {
                    type: Number,
                    default: 85,
                    min: [50, 'Minimum threshold is 50%'],
                    max: [95, 'Maximum threshold is 95%']
                },
                responseTime: {
                    type: Number,
                    default: 2000, // milliseconds
                    min: [500, 'Minimum threshold is 500ms'],
                    max: [10000, 'Maximum threshold is 10 seconds']
                }
            }
        }
    },

    // ** MAINTENANCE & UPDATES **
    maintenance: {
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        version: {
            type: String,
            default: '1.0.0'
        },
        backupBeforeUpdate: {
            type: Boolean,
            default: true
        },
        rollbackPlan: {
            enabled: {
                type: Boolean,
                default: true
            },
            snapshotRetention: {
                type: Number,
                default: 5, // keep last 5 snapshots
                min: [1, 'Minimum snapshots is 1'],
                max: [10, 'Maximum snapshots is 10']
            }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES **
systemSettingsSchema.index({ companyRef: 1 }, { unique: true });
systemSettingsSchema.index({ 'maintenance.lastUpdated': -1 });
systemSettingsSchema.index({ 'maintenance.version': 1 });

// ** VIRTUAL FIELDS **
systemSettingsSchema.virtual('isConfigurationComplete').get(function () {
    return !!(
        this.general.timeZone &&
        this.rcmWorkflow.defaultSlaHours &&
        this.qaSettings.samplingRules.defaultSamplingRate &&
        this.slaSettings.monitoring.alertThresholds
    );
});

systemSettingsSchema.virtual('securityCompliance').get(function () {
    const security = this.security;
    let score = 0;

    if (security.authentication.passwordPolicy.minLength >= 8) score += 20;
    if (security.authentication.mfa.required) score += 30;
    if (security.dataProtection.encryption.atRest) score += 25;
    if (security.dataProtection.encryption.inTransit) score += 25;

    return score;
});

// ** INSTANCE METHODS **
systemSettingsSchema.methods.updateSettings = function (settingsPath, value, updatedBy) {
    // Dynamically update nested settings
    const pathArray = settingsPath.split('.');
    let current = this;

    for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = value;
    this.maintenance.lastUpdated = new Date();
    this.maintenance.updatedBy = updatedBy;

    return this.save();
};

systemSettingsSchema.methods.resetToDefaults = function (section, updatedBy) {
    // Reset specific section to defaults
    const defaults = new this.constructor();

    if (section && this[section]) {
        this[section] = defaults[section];
    }

    this.maintenance.lastUpdated = new Date();
    this.maintenance.updatedBy = updatedBy;

    return this.save();
};

systemSettingsSchema.methods.validateConfiguration = function () {
    const errors = [];

    // Validate SLA thresholds
    if (this.slaSettings.monitoring.alertThresholds.yellow >= this.slaSettings.monitoring.alertThresholds.red) {
        errors.push('Yellow threshold must be less than red threshold');
    }

    // Validate business hours
    if (this.general.businessHours.startTime >= this.general.businessHours.endTime) {
        errors.push('Business start time must be before end time');
    }

    // Validate QA sampling rates
    const qa = this.qaSettings.samplingRules;
    if (qa.newEmployeeSamplingRate < qa.defaultSamplingRate) {
        errors.push('New employee sampling rate should be higher than default rate');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

systemSettingsSchema.methods.exportConfiguration = function () {
    const config = this.toObject();

    // Remove sensitive data
    delete config.notifications.channels.email.smtpConfig.password;
    delete config.notifications.channels.sms.apiKey;
    delete config.notifications.channels.slack.botToken;
    delete config._id;
    delete config.__v;
    delete config.createdAt;
    delete config.updatedAt;

    return config;
};

// ** STATIC METHODS **
systemSettingsSchema.statics.findByCompany = function (companyRef) {
    return this.findOne({ companyRef }).populate('maintenance.updatedBy', 'personalInfo.firstName personalInfo.lastName');
};

systemSettingsSchema.statics.createDefaultSettings = function (companyRef, createdBy) {
    const defaultSettings = new this({
        companyRef,
        'maintenance.updatedBy': createdBy
    });

    return defaultSettings.save();
};

systemSettingsSchema.statics.bulkUpdateSettings = function (companyRef, updates, updatedBy) {
    return this.findOneAndUpdate(
        { companyRef },
        {
            ...updates,
            'maintenance.lastUpdated': new Date(),
            'maintenance.updatedBy': updatedBy
        },
        { new: true, runValidators: true }
    );
};

// PLUGINS
systemSettingsSchema.plugin(scopedIdPlugin, {
    idField: 'settingsId',
    prefix: 'SET',
    companyRefPath: 'companyRef'
});

// ** PRE-SAVE MIDDLEWARE **
systemSettingsSchema.pre('save', function (next) {
    // Validate configuration
    const validation = this.validateConfiguration();

    if (!validation.isValid) {
        const error = new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
        return next(error);
    }

    // Update version if significant changes
    if (this.isModified() && !this.isNew) {
        const versionParts = this.maintenance.version.split('.');
        versionParts[2] = parseInt(versionParts[2]) + 1;
        this.maintenance.version = versionParts.join('.');
    }

    next();
});

// ** POST-SAVE MIDDLEWARE **
systemSettingsSchema.post('save', function (doc) {
    // Log configuration changes
    console.log(`System settings updated for company ${doc.companyRef} at ${doc.maintenance.lastUpdated}`);

    // Trigger cache invalidation if caching is enabled
    if (doc.performance.caching.enabled) {
        // Implementation would trigger cache clear
    }
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
export default SystemSettings;