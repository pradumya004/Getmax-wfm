// backend/src/models/clearinghouse/clearinghouse.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { scopedIdPlugin } from './../../plugins/scopedIdPlugin';

const clearinghouseSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFICATION **
    clearinghouseId: {
        type: String,
        unique: true,
        // default: () => `CH-${uuidv4().substring(0, 8).toUpperCase()}`,
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

    // ** CLEARINGHOUSE INFORMATION **
    clearinghouseInfo: {
        name: {
            type: String,
            required: [true, 'Clearinghouse name is required'],
            trim: true,
            index: true
        },
        displayName: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ['Primary', 'Secondary', 'Backup', 'Testing', 'Specialty'],
            required: [true, 'Clearinghouse type is required'],
            index: true
        },
        vendor: {
            type: String,
            enum: [
                'Availity', 'Change_Healthcare', 'RelayHealth', 'Emdeon', 'TriZetto',
                'Office_Ally', 'Waystar', 'NextGen', 'athenahealth', 'Trizetto_Provider_Solutions',
                'Passport_Health', 'MedAssets', 'Zirmed', 'Apex_EDI', 'GeBBS', 'Other'
            ],
            required: [true, 'Vendor is required'],
            index: true
        },
        vendorCode: {
            type: String,
            trim: true,
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        website: {
            type: String,
            trim: true
        },
        supportPhone: {
            type: String,
            trim: true
        },
        supportEmail: {
            type: String,
            trim: true
        },
        businessHours: {
            timezone: {
                type: String,
                default: 'EST'
            },
            weekdays: {
                start: {
                    type: String,
                    default: '08:00'
                },
                end: {
                    type: String,
                    default: '18:00'
                }
            },
            weekends: {
                available: {
                    type: Boolean,
                    default: false
                },
                start: String,
                end: String
            }
        }
    },

    // ** CONNECTION CONFIGURATION **
    connectionConfig: {
        // ** PRIMARY CONNECTION **
        primary: {
            protocol: {
                type: String,
                enum: ['HTTPS', 'SFTP', 'FTP', 'AS2', 'Direct_Connect', 'Web_Portal'],
                required: [true, 'Protocol is required']
            },
            hostname: {
                type: String,
                required: [true, 'Hostname is required'],
                trim: true
            },
            port: {
                type: Number,
                required: [true, 'Port is required'],
                min: [1, 'Port must be positive'],
                max: [65535, 'Port cannot exceed 65535']
            },
            basePath: {
                type: String,
                trim: true,
                default: '/'
            },
            useSSL: {
                type: Boolean,
                default: true
            },
            sslVersion: {
                type: String,
                enum: ['TLSv1.2', 'TLSv1.3', 'SSLv3'],
                default: 'TLSv1.2'
            },
            timeout: {
                connection: {
                    type: Number,
                    default: 30000, // 30 seconds
                    min: [5000, 'Connection timeout must be at least 5 seconds']
                },
                request: {
                    type: Number,
                    default: 120000, // 2 minutes
                    min: [10000, 'Request timeout must be at least 10 seconds']
                },
                response: {
                    type: Number,
                    default: 300000, // 5 minutes
                    min: [30000, 'Response timeout must be at least 30 seconds']
                }
            }
        },

        // ** BACKUP CONNECTION **
        backup: {
            enabled: {
                type: Boolean,
                default: false
            },
            protocol: String,
            hostname: String,
            port: Number,
            basePath: String,
            useSSL: {
                type: Boolean,
                default: true
            },
            timeout: {
                connection: Number,
                request: Number,
                response: Number
            }
        },

        // ** CONNECTION POOLING **
        pooling: {
            enabled: {
                type: Boolean,
                default: true
            },
            maxConnections: {
                type: Number,
                default: 10,
                min: [1, 'Max connections must be at least 1'],
                max: [100, 'Max connections cannot exceed 100']
            },
            minConnections: {
                type: Number,
                default: 2,
                min: [1, 'Min connections must be at least 1']
            },
            connectionLifetime: {
                type: Number,
                default: 3600000, // 1 hour in milliseconds
                min: [60000, 'Connection lifetime must be at least 1 minute']
            },
            idleTimeout: {
                type: Number,
                default: 300000, // 5 minutes
                min: [30000, 'Idle timeout must be at least 30 seconds']
            }
        },

        // ** RETRY CONFIGURATION **
        retryConfig: {
            enabled: {
                type: Boolean,
                default: true
            },
            maxRetries: {
                type: Number,
                default: 3,
                min: [1, 'Max retries must be at least 1'],
                max: [10, 'Max retries cannot exceed 10']
            },
            retryInterval: {
                type: Number,
                default: 60000, // 1 minute
                min: [10000, 'Retry interval must be at least 10 seconds']
            },
            backoffMultiplier: {
                type: Number,
                default: 2,
                min: [1, 'Backoff multiplier must be at least 1']
            },
            retryableErrors: [String] // HTTP status codes or error codes that should trigger retry
        }
    },

    // ** AUTHENTICATION CREDENTIALS **
    credentials: {
        authenticationType: {
            type: String,
            enum: ['Basic', 'Bearer_Token', 'API_Key', 'Certificate', 'OAuth2', 'Custom'],
            required: [true, 'Authentication type is required']
        },

        // ** BASIC AUTHENTICATION **
        basic: {
            username: {
                type: String,
                trim: true,
                index: true
            },
            password: {
                type: String,
                trim: true
                // Note: Should be encrypted before storage
            },
            realm: {
                type: String,
                trim: true
            }
        },

        // ** API KEY AUTHENTICATION **
        apiKey: {
            keyName: {
                type: String,
                trim: true
            },
            keyValue: {
                type: String,
                trim: true
                // Note: Should be encrypted before storage
            },
            keyLocation: {
                type: String,
                enum: ['Header', 'Query_Parameter', 'Body'],
                default: 'Header'
            }
        },

        // ** CERTIFICATE AUTHENTICATION **
        certificate: {
            certificateId: {
                type: String,
                trim: true
            },
            certificatePath: {
                type: String,
                trim: true
            },
            privateKeyPath: {
                type: String,
                trim: true
            },
            passphrase: {
                type: String,
                trim: true
                // Note: Should be encrypted before storage
            },
            certificateThumbprint: {
                type: String,
                trim: true
            },
            expirationDate: Date
        },

        // ** OAUTH2 AUTHENTICATION **
        oauth2: {
            clientId: {
                type: String,
                trim: true
            },
            clientSecret: {
                type: String,
                trim: true
                // Note: Should be encrypted before storage
            },
            tokenUrl: {
                type: String,
                trim: true
            },
            scope: [String],
            accessToken: {
                type: String,
                trim: true
            },
            refreshToken: {
                type: String,
                trim: true
            },
            tokenExpiresAt: Date,
            lastRefreshed: Date
        },

        // ** CREDENTIAL MANAGEMENT **
        credentialManagement: {
            lastUpdated: {
                type: Date,
                default: Date.now
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            expirationDate: Date,
            rotationSchedule: {
                type: String,
                enum: ['Never', 'Monthly', 'Quarterly', 'Semi_Annually', 'Annually'],
                default: 'Quarterly'
            },
            nextRotationDate: Date,
            testCredentials: {
                type: Boolean,
                default: false
            },
            lastTestedDate: Date,
            testResult: {
                type: String,
                enum: ['Success', 'Failed', 'Pending', 'Not_Tested'],
                default: 'Not_Tested'
            }
        }
    },

    // ** SUPPORTED SERVICES **
    supportedServices: {
        // ** EDI TRANSACTIONS **
        ediServices: {
            claims: {
                supported: {
                    type: Boolean,
                    default: true
                },
                formats: [{
                    type: String,
                    enum: ['837P', '837I', '837D'],
                    required: true
                }],
                versions: [String], // e.g., ['005010X222A1', '004010X098A1']
                maxBatchSize: {
                    type: Number,
                    default: 1000,
                    min: [1, 'Max batch size must be at least 1']
                },
                maxFileSize: {
                    type: Number,
                    default: 100 * 1024 * 1024, // 100MB in bytes
                    min: [1024, 'Max file size must be at least 1KB']
                }
            },
            eligibility: {
                supported: {
                    type: Boolean,
                    default: true
                },
                realTime: {
                    type: Boolean,
                    default: true
                },
                batch: {
                    type: Boolean,
                    default: true
                },
                responseTime: {
                    type: Number,
                    default: 5000, // milliseconds
                    min: [1000, 'Response time must be at least 1 second']
                }
            },
            claimStatus: {
                supported: {
                    type: Boolean,
                    default: true
                },
                formats: [{
                    type: String,
                    enum: ['276', '277'],
                    required: true
                }],
                realTime: {
                    type: Boolean,
                    default: true
                }
            },
            authorization: {
                supported: {
                    type: Boolean,
                    default: false
                },
                formats: [String],
                responseTime: {
                    type: Number,
                    default: 30000 // 30 seconds
                }
            },
            payments: {
                supported: {
                    type: Boolean,
                    default: true
                },
                formats: [{
                    type: String,
                    enum: ['835'],
                    required: true
                }],
                frequency: {
                    type: String,
                    enum: ['Real_Time', 'Daily', 'Weekly', 'Monthly'],
                    default: 'Daily'
                }
            }
        },

        // ** ADDITIONAL SERVICES **
        additionalServices: {
            providerEnrollment: {
                type: Boolean,
                default: false
            },
            credentialing: {
                type: Boolean,
                default: false
            },
            reporting: {
                type: Boolean,
                default: true
            },
            analytics: {
                type: Boolean,
                default: false
            },
            patientPortal: {
                type: Boolean,
                default: false
            },
            mobileAccess: {
                type: Boolean,
                default: false
            }
        }
    },

    // ** SLA AND PERFORMANCE **
    slaConfig: {
        // ** UPTIME REQUIREMENTS **
        uptime: {
            guaranteedUptime: {
                type: Number,
                default: 99.5,
                min: [90, 'Uptime guarantee cannot be less than 90%'],
                max: [100, 'Uptime guarantee cannot exceed 100%']
            },
            maintenanceWindows: [{
                dayOfWeek: {
                    type: String,
                    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    required: true
                },
                startTime: {
                    type: String,
                    required: true
                },
                endTime: {
                    type: String,
                    required: true
                },
                timezone: {
                    type: String,
                    default: 'EST'
                }
            }],
            plannedDowntime: [{
                startDate: Date,
                endDate: Date,
                reason: String,
                impactLevel: {
                    type: String,
                    enum: ['Low', 'Medium', 'High'],
                    default: 'Low'
                }
            }]
        },

        // ** RESPONSE TIME REQUIREMENTS **
        responseTime: {
            eligibilityCheck: {
                type: Number,
                default: 10000, // 10 seconds
                min: [1000, 'Response time must be at least 1 second']
            },
            claimSubmission: {
                type: Number,
                default: 30000, // 30 seconds
                min: [5000, 'Response time must be at least 5 seconds']
            },
            statusInquiry: {
                type: Number,
                default: 15000, // 15 seconds
                min: [2000, 'Response time must be at least 2 seconds']
            },
            acknowledgment: {
                type: Number,
                default: 60000, // 1 minute
                min: [10000, 'Response time must be at least 10 seconds']
            }
        },

        // ** THROUGHPUT REQUIREMENTS **
        throughput: {
            maxTransactionsPerHour: {
                type: Number,
                default: 10000,
                min: [100, 'Throughput must be at least 100 transactions per hour']
            },
            maxConcurrentConnections: {
                type: Number,
                default: 50,
                min: [5, 'Concurrent connections must be at least 5']
            },
            burstCapacity: {
                type: Number,
                default: 150, // percentage of normal capacity
                min: [100, 'Burst capacity must be at least 100%']
            }
        },

        // ** ERROR RATE THRESHOLDS **
        errorThresholds: {
            maxErrorRate: {
                type: Number,
                default: 1, // percentage
                min: [0, 'Error rate cannot be negative'],
                max: [10, 'Error rate cannot exceed 10%']
            },
            maxConsecutiveErrors: {
                type: Number,
                default: 5,
                min: [1, 'Max consecutive errors must be at least 1']
            },
            errorWindowMinutes: {
                type: Number,
                default: 60,
                min: [5, 'Error window must be at least 5 minutes']
            }
        }
    },

    // ** PRICING AND BILLING **
    pricing: {
        pricingModel: {
            type: String,
            enum: ['Per_Transaction', 'Monthly_Flat', 'Tiered', 'Volume_Based', 'Custom'],
            default: 'Per_Transaction'
        },

        // ** TRANSACTION PRICING **
        transactionPricing: [{
            transactionType: {
                type: String,
                enum: ['837P', '837I', '837D', '270', '271', '276', '277', '278', '835'],
                required: true
            },
            pricePerTransaction: {
                type: Number,
                required: true,
                min: [0, 'Price cannot be negative']
            },
            minimumMonthly: {
                type: Number,
                default: 0,
                min: [0, 'Minimum monthly cannot be negative']
            },
            freeTransactionsPerMonth: {
                type: Number,
                default: 0,
                min: [0, 'Free transactions cannot be negative']
            }
        }],

        // ** VOLUME TIERS **
        volumeTiers: [{
            tierName: String,
            minVolume: {
                type: Number,
                required: true,
                min: [0, 'Minimum volume cannot be negative']
            },
            maxVolume: {
                type: Number,
                min: [0, 'Maximum volume cannot be negative']
            },
            pricePerTransaction: {
                type: Number,
                required: true,
                min: [0, 'Price cannot be negative']
            },
            discountPercentage: {
                type: Number,
                default: 0,
                min: [0, 'Discount cannot be negative'],
                max: [100, 'Discount cannot exceed 100%']
            }
        }],

        // ** ADDITIONAL FEES **
        additionalFees: {
            setupFee: {
                type: Number,
                default: 0,
                min: [0, 'Setup fee cannot be negative']
            },
            monthlyMaintenanceFee: {
                type: Number,
                default: 0,
                min: [0, 'Monthly fee cannot be negative']
            },
            supportFee: {
                type: Number,
                default: 0,
                min: [0, 'Support fee cannot be negative']
            },
            expediteFee: {
                type: Number,
                default: 0,
                min: [0, 'Expedite fee cannot be negative']
            },
            customReportFee: {
                type: Number,
                default: 0,
                min: [0, 'Custom report fee cannot be negative']
            }
        },

        // ** BILLING CONFIGURATION **
        billingConfig: {
            billingCycle: {
                type: String,
                enum: ['Monthly', 'Quarterly', 'Annually'],
                default: 'Monthly'
            },
            paymentTerms: {
                type: String,
                enum: ['Net_15', 'Net_30', 'Net_45', 'Net_60', 'Prepaid'],
                default: 'Net_30'
            },
            invoiceDelivery: {
                type: String,
                enum: ['Email', 'Portal', 'Mail', 'EDI'],
                default: 'Email'
            },
            currency: {
                type: String,
                default: 'USD',
                enum: ['USD', 'EUR', 'GBP', 'CAD']
            }
        }
    },

    // ** MONITORING AND ALERTING **
    monitoring: {
        // ** HEALTH CHECK CONFIGURATION **
        healthCheck: {
            enabled: {
                type: Boolean,
                default: true
            },
            frequency: {
                type: Number,
                default: 300000, // 5 minutes
                min: [60000, 'Health check frequency must be at least 1 minute']
            },
            endpoint: String,
            method: {
                type: String,
                enum: ['GET', 'POST', 'HEAD'],
                default: 'GET'
            },
            expectedResponseCode: {
                type: Number,
                default: 200
            },
            timeout: {
                type: Number,
                default: 30000,
                min: [5000, 'Health check timeout must be at least 5 seconds']
            },
            retries: {
                type: Number,
                default: 3,
                min: [1, 'Health check retries must be at least 1']
            }
        },

        // ** ALERT CONFIGURATION **
        alerts: {
            connectionFailure: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                threshold: {
                    type: Number,
                    default: 3, // consecutive failures
                    min: [1, 'Threshold must be at least 1']
                },
                recipients: [String] // email addresses
            },
            responseTimeDelay: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                threshold: {
                    type: Number,
                    default: 30000, // 30 seconds
                    min: [5000, 'Threshold must be at least 5 seconds']
                },
                recipients: [String]
            },
            errorRateHigh: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                threshold: {
                    type: Number,
                    default: 5, // percentage
                    min: [1, 'Threshold must be at least 1%']
                },
                recipients: [String]
            },
            downtimeAlert: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                recipients: [String]
            }
        },

        // ** LOGGING CONFIGURATION **
        logging: {
            enabled: {
                type: Boolean,
                default: true
            },
            logLevel: {
                type: String,
                enum: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
                default: 'INFO'
            },
            retentionDays: {
                type: Number,
                default: 90,
                min: [7, 'Log retention must be at least 7 days'],
                max: [2555, 'Log retention cannot exceed 7 years']
            },
            logRequests: {
                type: Boolean,
                default: true
            },
            logResponses: {
                type: Boolean,
                default: true
            },
            logErrors: {
                type: Boolean,
                default: true
            },
            maskSensitiveData: {
                type: Boolean,
                default: true
            }
        }
    },

    // ** STATUS AND LIFECYCLE **
    status: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        currentStatus: {
            type: String,
            enum: ['Active', 'Testing', 'Maintenance', 'Suspended', 'Terminated', 'Migrating'],
            default: 'Testing',
            index: true
        },
        activatedDate: Date,
        suspendedDate: Date,
        terminatedDate: Date,
        suspensionReason: String,
        terminationReason: String,

        // ** CONNECTION STATUS **
        connectionStatus: {
            lastConnected: Date,
            lastSuccessfulTransaction: Date,
            consecutiveFailures: {
                type: Number,
                default: 0,
                min: [0, 'Consecutive failures cannot be negative']
            },
            isCurrentlyConnected: {
                type: Boolean,
                default: false,
                index: true
            },
            lastConnectionError: String,
            lastConnectionAttempt: Date
        },

        // ** PERFORMANCE METRICS **
        performanceMetrics: {
            totalTransactions: {
                type: Number,
                default: 0,
                min: [0, 'Total transactions cannot be negative']
            },
            successfulTransactions: {
                type: Number,
                default: 0,
                min: [0, 'Successful transactions cannot be negative']
            },
            failedTransactions: {
                type: Number,
                default: 0,
                min: [0, 'Failed transactions cannot be negative']
            },
            averageResponseTime: {
                type: Number,
                default: 0,
                min: [0, 'Average response time cannot be negative']
            },
            uptimePercentage: {
                type: Number,
                default: 100,
                min: [0, 'Uptime percentage cannot be negative'],
                max: [100, 'Uptime percentage cannot exceed 100%']
            },
            lastResetDate: {
                type: Date,
                default: Date.now
            }
        }
    },

    // ** COMPLIANCE AND SECURITY **
    compliance: {
        certifications: [{
            certificationType: {
                type: String,
                enum: ['HIPAA', 'SOC2', 'PCI_DSS', 'ISO_27001', 'HITECH', 'Other'],
                required: true
            },
            certificationNumber: String,
            issuedBy: String,
            issuedDate: Date,
            expirationDate: Date,
            isActive: {
                type: Boolean,
                default: true
            },
            documentUrl: String
        }],

        // ** SECURITY REQUIREMENTS **
        securityRequirements: {
            dataEncryption: {
                required: {
                    type: Boolean,
                    default: true
                },
                atRest: {
                    type: Boolean,
                    default: true
                },
                inTransit: {
                    type: Boolean,
                    default: true
                },
                algorithm: {
                    type: String,
                    enum: ['AES-256', 'AES-128', 'RSA', 'Other'],
                    default: 'AES-256'
                }
            },
            accessControls: {
                twoFactorAuth: {
                    type: Boolean,
                    default: false
                },
                ipWhitelisting: {
                    type: Boolean,
                    default: false
                },
                whitelistedIPs: [String],
                accessLogging: {
                    type: Boolean,
                    default: true
                }
            },
            auditRequirements: {
                logAllTransactions: {
                    type: Boolean,
                    default: true
                },
                logRetentionDays: {
                    type: Number,
                    default: 2555, // 7 years
                    min: [365, 'Log retention must be at least 1 year']
                },
                auditFrequency: {
                    type: String,
                    enum: ['Monthly', 'Quarterly', 'Semi_Annually', 'Annually'],
                    default: 'Annually'
                }
            }
        }
    },

    // ** CONTRACT AND LEGAL **
    contractInfo: {
        contractNumber: String,
        contractStartDate: Date,
        contractEndDate: Date,
        autoRenewal: {
            type: Boolean,
            default: false
        },
        renewalNoticeReqdDays: {
            type: Number,
            default: 90,
            min: [30, 'Renewal notice must be at least 30 days']
        },
        terminationNoticeReqdDays: {
            type: Number,
            default: 30,
            min: [15, 'Termination notice must be at least 15 days']
        },
        contractDocuments: [{
            documentType: {
                type: String,
                enum: ['Master_Agreement', 'SOW', 'Amendment', 'Addendum', 'SLA', 'DPA'],
                required: true
            },
            documentName: String,
            documentUrl: String,
            signedDate: Date,
            effectiveDate: Date,
            expirationDate: Date
        }],
        businessAssociate: {
            isBAA: {
                type: Boolean,
                default: false
            },
            baaSignedDate: Date,
            baaExpirationDate: Date,
            baaDocumentUrl: String
        }
    },

    // ** AUDIT INFORMATION **
    auditInfo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        modifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastReviewDate: Date,
        nextReviewDate: Date,

        // ** CHANGE HISTORY **
        changeHistory: [{
            changeType: {
                type: String,
                enum: ['Configuration', 'Credentials', 'Status', 'Pricing', 'Contract', 'Other'],
                required: true
            },
            changeDescription: String,
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            changeDate: {
                type: Date,
                default: Date.now
            },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            approvalDate: Date,
            oldValues: mongoose.Schema.Types.Mixed,
            newValues: mongoose.Schema.Types.Mixed,
            impactAssessment: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR PERFORMANCE **
clearinghouseSchema.index({ companyRef: 1, 'clearinghouseInfo.vendor': 1 });
clearinghouseSchema.index({ 'status.currentStatus': 1, 'status.isActive': 1 });
clearinghouseSchema.index({ 'clearinghouseInfo.type': 1, 'status.currentStatus': 1 });
clearinghouseSchema.index({ 'credentials.basic.username': 1 });
clearinghouseSchema.index({ 'connectionConfig.primary.hostname': 1 });

// Compound indexes for complex queries
clearinghouseSchema.index({
    companyRef: 1,
    'clearinghouseInfo.type': 1,
    'status.isActive': 1,
    'status.currentStatus': 1
});

// ** VIRTUAL FIELDS **
clearinghouseSchema.virtual('isConnected').get(function () {
    return this.status.connectionStatus.isCurrentlyConnected &&
        this.status.currentStatus === 'Active';
});

clearinghouseSchema.virtual('successRate').get(function () {
    const total = this.status.performanceMetrics.totalTransactions;
    const successful = this.status.performanceMetrics.successfulTransactions;
    return total > 0 ? Math.round((successful / total) * 100) : 0;
});

clearinghouseSchema.virtual('isContractExpiringSoon').get(function () {
    if (!this.contractInfo.contractEndDate) return false;
    const now = new Date();
    const expirationDate = new Date(this.contractInfo.contractEndDate);
    const daysUntilExpiration = Math.floor((expirationDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 90; // Within 90 days
});

clearinghouseSchema.virtual('hasExpiredCertifications').get(function () {
    const now = new Date();
    return this.compliance.certifications.some(cert =>
        cert.isActive && cert.expirationDate && cert.expirationDate < now
    );
});

// ** INSTANCE METHODS **
clearinghouseSchema.methods.testConnection = async function (testedBy) {
    this.status.connectionStatus.lastConnectionAttempt = new Date();

    try {
        // Implementation would test actual connection
        // For now, simulate connection test
        const connectionSuccessful = Math.random() > 0.1; // 90% success rate

        if (connectionSuccessful) {
            this.status.connectionStatus.isCurrentlyConnected = true;
            this.status.connectionStatus.lastConnected = new Date();
            this.status.connectionStatus.consecutiveFailures = 0;
            this.status.connectionStatus.lastConnectionError = null;
            this.credentials.credentialManagement.testResult = 'Success';
        } else {
            this.status.connectionStatus.isCurrentlyConnected = false;
            this.status.connectionStatus.consecutiveFailures++;
            this.status.connectionStatus.lastConnectionError = 'Connection timeout';
            this.credentials.credentialManagement.testResult = 'Failed';
        }

        this.credentials.credentialManagement.lastTestedDate = new Date();

        // Add change history entry
        this.auditInfo.changeHistory.push({
            changeType: 'Other',
            changeDescription: `Connection test ${connectionSuccessful ? 'successful' : 'failed'}`,
            changedBy: testedBy,
            changeDate: new Date()
        });

        await this.save();
        return connectionSuccessful;

    } catch (error) {
        this.status.connectionStatus.isCurrentlyConnected = false;
        this.status.connectionStatus.consecutiveFailures++;
        this.status.connectionStatus.lastConnectionError = error.message;
        this.credentials.credentialManagement.testResult = 'Failed';
        await this.save();
        throw error;
    }
};

clearinghouseSchema.methods.updateCredentials = function (newCredentials, updatedBy) {
    // Update credentials based on authentication type
    if (newCredentials.basic) {
        this.credentials.basic = { ...this.credentials.basic, ...newCredentials.basic };
    }
    if (newCredentials.apiKey) {
        this.credentials.apiKey = { ...this.credentials.apiKey, ...newCredentials.apiKey };
    }
    if (newCredentials.certificate) {
        this.credentials.certificate = { ...this.credentials.certificate, ...newCredentials.certificate };
    }
    if (newCredentials.oauth2) {
        this.credentials.oauth2 = { ...this.credentials.oauth2, ...newCredentials.oauth2 };
    }

    // Update credential management info
    this.credentials.credentialManagement.lastUpdated = new Date();
    this.credentials.credentialManagement.updatedBy = updatedBy;
    this.credentials.credentialManagement.testCredentials = false;
    this.credentials.credentialManagement.testResult = 'Not_Tested';

    // Calculate next rotation date
    if (this.credentials.credentialManagement.rotationSchedule !== 'Never') {
        const nextRotation = new Date();
        switch (this.credentials.credentialManagement.rotationSchedule) {
            case 'Monthly':
                nextRotation.setMonth(nextRotation.getMonth() + 1);
                break;
            case 'Quarterly':
                nextRotation.setMonth(nextRotation.getMonth() + 3);
                break;
            case 'Semi_Annually':
                nextRotation.setMonth(nextRotation.getMonth() + 6);
                break;
            case 'Annually':
                nextRotation.setFullYear(nextRotation.getFullYear() + 1);
                break;
        }
        this.credentials.credentialManagement.nextRotationDate = nextRotation;
    }

    // Add change history entry
    this.auditInfo.changeHistory.push({
        changeType: 'Credentials',
        changeDescription: 'Credentials updated',
        changedBy: updatedBy,
        changeDate: new Date()
    });

    return this.save();
};

clearinghouseSchema.methods.updatePerformanceMetrics = function (transactionResult) {
    this.status.performanceMetrics.totalTransactions++;

    if (transactionResult.successful) {
        this.status.performanceMetrics.successfulTransactions++;
        this.status.connectionStatus.lastSuccessfulTransaction = new Date();
        this.status.connectionStatus.consecutiveFailures = 0;
    } else {
        this.status.performanceMetrics.failedTransactions++;
        this.status.connectionStatus.consecutiveFailures++;
    }

    // Update average response time
    if (transactionResult.responseTime) {
        const currentAvg = this.status.performanceMetrics.averageResponseTime;
        const count = this.status.performanceMetrics.totalTransactions;
        this.status.performanceMetrics.averageResponseTime =
            ((currentAvg * (count - 1)) + transactionResult.responseTime) / count;
    }

    return this.save();
};

clearinghouseSchema.methods.activate = function (activatedBy) {
    this.status.currentStatus = 'Active';
    this.status.activatedDate = new Date();
    this.status.suspendedDate = null;
    this.status.suspensionReason = null;

    this.auditInfo.changeHistory.push({
        changeType: 'Status',
        changeDescription: 'Clearinghouse activated',
        changedBy: activatedBy,
        changeDate: new Date()
    });

    return this.save();
};

clearinghouseSchema.methods.suspend = function (suspendedBy, reason) {
    this.status.currentStatus = 'Suspended';
    this.status.suspendedDate = new Date();
    this.status.suspensionReason = reason;

    this.auditInfo.changeHistory.push({
        changeType: 'Status',
        changeDescription: `Clearinghouse suspended: ${reason}`,
        changedBy: suspendedBy,
        changeDate: new Date()
    });

    return this.save();
};

// ** STATIC METHODS **
clearinghouseSchema.statics.findActive = function (companyRef) {
    return this.find({
        companyRef,
        'status.isActive': true,
        'status.currentStatus': 'Active'
    }).sort({ 'clearinghouseInfo.type': 1, 'clearinghouseInfo.name': 1 });
};

clearinghouseSchema.statics.findByVendor = function (vendor) {
    return this.find({
        'clearinghouseInfo.vendor': vendor,
        'status.isActive': true
    }).sort({ 'clearinghouseInfo.name': 1 });
};

clearinghouseSchema.statics.findExpiringContracts = function (daysAhead = 90) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.find({
        'contractInfo.contractEndDate': { $lte: futureDate },
        'status.isActive': true
    }).sort({ 'contractInfo.contractEndDate': 1 });
};

clearinghouseSchema.statics.findConnectionIssues = function (companyRef) {
    return this.find({
        companyRef,
        $or: [
            { 'status.connectionStatus.consecutiveFailures': { $gte: 3 } },
            { 'status.connectionStatus.isCurrentlyConnected': false },
            { 'status.currentStatus': 'Maintenance' }
        ],
        'status.isActive': true
    }).sort({ 'status.connectionStatus.consecutiveFailures': -1 });
};

clearinghouseSchema.statics.getPerformanceReport = function (companyRef, dateRange) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyRef),
                'status.isActive': true
            }
        },
        {
            $project: {
                name: '$clearinghouseInfo.name',
                vendor: '$clearinghouseInfo.vendor',
                totalTransactions: '$status.performanceMetrics.totalTransactions',
                successfulTransactions: '$status.performanceMetrics.successfulTransactions',
                failedTransactions: '$status.performanceMetrics.failedTransactions',
                averageResponseTime: '$status.performanceMetrics.averageResponseTime',
                uptimePercentage: '$status.performanceMetrics.uptimePercentage',
                successRate: {
                    $cond: [
                        { $gt: ['$status.performanceMetrics.totalTransactions', 0] },
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        '$status.performanceMetrics.successfulTransactions',
                                        '$status.performanceMetrics.totalTransactions'
                                    ]
                                },
                                100
                            ]
                        },
                        0
                    ]
                }
            }
        },
        {
            $sort: { successRate: -1 }
        }
    ]);
};

clearinghouseSchema.plugin(scopedIdPlugin, {
    idField: 'clearinghouseId',
    prefix: 'CH',
    companyRefPath: 'companyRef'
})

// ** PRE-SAVE MIDDLEWARE **
clearinghouseSchema.pre('save', function (next) {
    // Set next review date if not set
    if (!this.auditInfo.nextReviewDate) {
        const nextReview = new Date();
        nextReview.setFullYear(nextReview.getFullYear() + 1);
        this.auditInfo.nextReviewDate = nextReview;
    }

    // Reset performance metrics if last reset was over a month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (this.status.performanceMetrics.lastResetDate < oneMonthAgo) {
        this.status.performanceMetrics = {
            totalTransactions: 0,
            successfulTransactions: 0,
            failedTransactions: 0,
            averageResponseTime: 0,
            uptimePercentage: 100,
            lastResetDate: new Date()
        };
    }

    next();
});

export const Clearinghouse = mongoose.model('Clearinghouse', clearinghouseSchema, 'clearinghouses');