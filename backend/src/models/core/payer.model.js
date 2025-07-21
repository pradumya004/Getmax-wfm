// backend/src/models/core/payer.model.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

// EDI Mappings Schema 
const ediMappingsSchema = new mongoose.Schema({
    // Clearinghouse-specific mappings
    clearinghouseMappings: [{
        clearinghouseName: {
            type: String,
            enum: ['Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto', 'Office Ally', 'Navicure', 'athenaCollector', 'NextGen', 'AllMeds', 'ClaimMD'],
            required: true
        },
        payerId: {
            type: String,
            required: true,
            trim: true
        },
        receiverId: String,
        submitterId: String,
        isActive: {
            type: Boolean,
            default: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        connectionTested: {
            type: Boolean,
            default: false
        },
        testResults: {
            lastTestDate: Date,
            testStatus: {
                type: String,
                enum: ['Success', 'Failed', 'Pending', 'Not Tested'],
                default: 'Not Tested'
            },
            errorMessage: String,
            responseTime: Number // milliseconds
        }
    }],

    // Transaction-specific mappings
    transactionMappings: {
        // Eligibility (270/271) mappings
        eligibility: {
            supportedTransactions: [{
                type: String,
                enum: ['270', '271']
            }],
            fieldMappings: [{
                standardField: String,
                payerField: String,
                isRequired: Boolean,
                dataType: String,
                validValues: [String],
                transformation: String
            }],
            responseFormatting: {
                dateFormat: String,
                currencyFormat: String,
                specialHandling: [String]
            }
        },

        // Claims Status (276/277) mappings
        claimsStatus: {
            supportedTransactions: [{
                type: String,
                enum: ['276', '277']
            }],
            fieldMappings: [{
                standardField: String,
                payerField: String,
                isRequired: Boolean,
                dataType: String,
                validValues: [String]
            }],
            statusCodes: [{
                payerCode: String,
                standardCode: String,
                description: String,
                category: String
            }]
        },

        // Claims (837) mappings
        claims: {
            supportedTransactions: [{
                type: String,
                enum: ['837P', '837I', '837D']
            }],
            fieldMappings: [{
                standardField: String,
                payerField: String,
                isRequired: Boolean,
                dataType: String,
                maxLength: Number,
                validationRules: [String]
            }],
            claimTypes: [{
                payerType: String,
                standardType: String,
                description: String
            }],
            specialRequirements: [String]
        },

        // ERA (835) mappings
        era: {
            fieldMappings: [{
                standardField: String,
                payerField: String,
                dataType: String,
                transformation: String
            }],
            adjustmentCodes: [{
                payerCode: String,
                standardCode: String,
                description: String,
                category: String
            }],
            reasonCodes: [{
                payerCode: String,
                standardCode: String,
                description: String,
                actionRequired: String
            }]
        },

        // Authorization (278) mappings
        authorization: {
            fieldMappings: [{
                standardField: String,
                payerField: String,
                isRequired: Boolean,
                dataType: String
            }],
            serviceTypeCodes: [{
                payerCode: String,
                standardCode: String,
                description: String,
                requiresAuth: Boolean
            }],
            responseHandling: {
                approvalFormat: String,
                denialFormat: String,
                pendingFormat: String
            }
        }
    },

    // Custom business rules
    businessRules: {
        claimSubmissionRules: [{
            ruleName: String,
            condition: String,
            action: String,
            priority: Number,
            isActive: Boolean
        }],
        validationRules: [{
            field: String,
            validationType: String,
            parameters: mongoose.Schema.Types.Mixed,
            errorMessage: String
        }],
        formatRules: [{
            field: String,
            formatRule: String,
            transformation: String
        }]
    },

    // Data quality settings
    dataQualitySettings: {
        requiredFields: [String],
        optionalFields: [String],
        conditionalFields: [{
            field: String,
            condition: String,
            requiredWhen: String
        }],
        validationLevel: {
            type: String,
            enum: ['Basic', 'Standard', 'Strict'],
            default: 'Standard'
        }
    },

    // Performance tracking
    mappingPerformance: {
        lastUpdated: Date,
        successRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        averageProcessingTime: Number, // milliseconds
        errorRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        totalTransactions: {
            type: Number,
            default: 0
        },
        failedTransactions: {
            type: Number,
            default: 0
        }
    }
}, { _id: false });

// SLA Metrics Schema 
const slaMetricsSchema = new mongoose.Schema({
    // Overall SLA performance
    overallMetrics: {
        responseTimeTarget: {
            type: Number,
            default: 24 // hours
        },
        currentResponseTime: {
            type: Number,
            default: 0
        },
        responseTimeCompliance: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        availabilityTarget: {
            type: Number,
            default: 99.5 // percentage
        },
        currentAvailability: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },

    // Transaction-specific SLA metrics
    transactionMetrics: [{
        transactionType: {
            type: String,
            enum: ['270/271', '276/277', '837P', '837I', '835', '278', '999', '997'],
            required: true
        },
        slaTarget: {
            responseTime: Number, // hours
            successRate: Number, // percentage
            availability: Number // percentage
        },
        currentPerformance: {
            averageResponseTime: Number,
            successRate: Number,
            availability: Number,
            totalTransactions: { type: Number, default: 0 },
            successfulTransactions: { type: Number, default: 0 },
            failedTransactions: { type: Number, default: 0 }
        },
        complianceStatus: {
            type: String,
            enum: ['Compliant', 'At Risk', 'Non-Compliant'],
            default: 'Compliant'
        },
        lastMeasured: Date
    }],

    // Historical performance data
    historicalData: [{
        period: {
            year: Number,
            month: Number,
            week: Number
        },
        metrics: {
            averageResponseTime: Number,
            successRate: Number,
            availability: Number,
            totalVolume: Number,
            errorRate: Number
        },
        slaBreaches: [{
            breachType: String,
            breachDate: Date,
            duration: Number, // minutes
            impact: String,
            resolution: String
        }]
    }],

    // Escalation tracking
    escalations: [{
        escalationId: String,
        escalationDate: Date,
        escalationType: {
            type: String,
            enum: ['Response Time', 'Availability', 'Error Rate', 'Data Quality']
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical']
        },
        description: String,
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open'
        },
        assignedTo: String,
        resolution: String,
        resolvedDate: Date,
        resolutionTime: Number // hours
    }],

    // Performance targets and thresholds
    performanceTargets: {
        eligibilityVerification: {
            responseTime: { type: Number, default: 2 }, // hours
            successRate: { type: Number, default: 99 }, // percentage
            availability: { type: Number, default: 99.5 }
        },
        claimsStatus: {
            responseTime: { type: Number, default: 4 },
            successRate: { type: Number, default: 98 },
            availability: { type: Number, default: 99 }
        },
        claimsSubmission: {
            responseTime: { type: Number, default: 8 },
            successRate: { type: Number, default: 97 },
            availability: { type: Number, default: 99 }
        },
        eraProcessing: {
            responseTime: { type: Number, default: 24 },
            successRate: { type: Number, default: 99 },
            availability: { type: Number, default: 99.5 }
        },
        authorization: {
            responseTime: { type: Number, default: 72 },
            successRate: { type: Number, default: 95 },
            availability: { type: Number, default: 98 }
        }
    },

    // Alerting configuration
    alertingConfig: {
        enableAlerts: { type: Boolean, default: true },
        alertThresholds: {
            responseTimeWarning: Number, // percentage of target
            responseTimeCritical: Number,
            successRateWarning: Number,
            successRateCritical: Number,
            availabilityWarning: Number,
            availabilityCritical: Number
        },
        alertRecipients: [{
            email: String,
            alertTypes: [String],
            severity: [String]
        }]
    }
}, { _id: false });

// Main Payer Schema (PRESERVING ALL EXISTING FIELDS + ENHANCEMENTS)
const payerSchema = new mongoose.Schema({
    // EXISTING PAYER ID (PRESERVED EXACTLY)
    payerId: {
        type: String,
        unique: true,
        // default: () => `PAY-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
        index: true
    },

    // EXISTING MAIN RELATIONSHIPS (PRESERVED EXACTLY)
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    // EXISTING PAYER INFORMATION (PRESERVED EXACTLY)
    payerInfo: {
        payerName: {
            type: String,
            required: [true, 'Payer name is required'],
            trim: true,
            maxlength: [100, 'Payer name cannot exceed 100 characters'],
            index: true
        },
        legalName: {
            type: String,
            trim: true,
            maxlength: [150, 'Legal name cannot exceed 150 characters']
        },
        payerType: {
            type: String,
            enum: [
                'Commercial Insurance',
                'Medicare',
                'Medicaid',
                'Medicare Advantage',
                'Medicare Supplement',
                'Workers Compensation',
                'Auto Insurance',
                'Liability Insurance',
                'Self-Insured',
                'Government',
                'Other'
            ],
            required: [true, 'Payer type is required'],
            index: true
        },
        parentCompany: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^https?:\/\/.+/.test(v);
                },
                message: 'Website must be a valid URL'
            }
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        taxId: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^\d{2}-\d{7}$/.test(v);
                },
                message: 'Tax ID must be in XX-XXXXXXX format'
            }
        },
        naic: {
            type: String, // National Association of Insurance Commissioners code
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^\d{5}$/.test(v);
                },
                message: 'NAIC code must be 5 digits'
            }
        }
    },

    // EXISTING PAYER IDENTIFIERS & CODES (PRESERVED EXACTLY)
    identifiers: {
        payerIdNumber: {
            type: String,
            unique: true,
            trim: true,
            index: true
        },
        clearinghouseIds: [{
            clearinghouseName: {
                type: String,
                enum: [
                    'Availity', 'Change Healthcare', 'RelayHealth', 'Trizetto',
                    'Office Ally', 'Navicure', 'athenaCollector', 'NextGen',
                    'AllMeds', 'ClaimMD', 'Other'
                ],
                required: true
            },
            payerId: {
                type: String,
                required: true,
                trim: true
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }],
        x12PayerId: {
            type: String,
            trim: true,
            index: true
        },
        medicareContractNumber: {
            type: String,
            trim: true
        },
        medicaidPlanId: {
            type: String,
            trim: true
        }
    },

    // EXISTING CONTACT INFORMATION (PRESERVED EXACTLY)
    contactInfo: {
        primaryContact: {
            name: String,
            title: String,
            email: {
                type: String,
                trim: true,
                lowercase: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                    },
                    message: 'Invalid email format'
                }
            },
            phone: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
                    },
                    message: 'Invalid phone number format'
                }
            },
            fax: String
        },
        customerService: {
            phone: {
                type: String,
                trim: true
            },
            hours: {
                type: String,
                default: 'Monday-Friday 8AM-5PM'
            },
            email: String,
            website: String
        },
        providerServices: {
            phone: String,
            email: String,
            website: String,
            portalUrl: String
        },
        claimsSubmission: {
            phone: String,
            email: String,
            fax: String,
            mailingAddress: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: {
                    type: String,
                    default: 'United States'
                }
            }
        }
    },

    // EXISTING BUSINESS ADDRESS (PRESERVED EXACTLY)
    addressInfo: {
        corporateHeadquarters: {
            street: {
                type: String,
                trim: true,
                maxlength: [200, 'Street address cannot exceed 200 characters']
            },
            city: {
                type: String,
                trim: true,
                maxlength: [100, 'City cannot exceed 100 characters']
            },
            state: {
                type: String,
                trim: true,
                maxlength: [50, 'State cannot exceed 50 characters']
            },
            zipCode: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return !v || /^\d{5}(-\d{4})?$/.test(v);
                    },
                    message: 'Invalid ZIP code format'
                }
            },
            country: {
                type: String,
                default: 'United States'
            }
        },
        regionalOffices: [{
            officeName: String,
            region: String,
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String
            },
            servicesOffered: [String]
        }]
    },

    // EXISTING COVERAGE & PLANS (PRESERVED EXACTLY)
    coverageInfo: {
        linesOfBusiness: [{
            type: String,
            enum: [
                'Individual Health',
                'Group Health',
                'Medicare Supplement',
                'Medicare Advantage',
                'Medicaid',
                'Dental',
                'Vision',
                'Life Insurance',
                'Disability',
                'Workers Compensation',
                'Auto Insurance',
                'Property & Casualty'
            ]
        }],
        marketSegments: [{
            type: String,
            enum: ['Individual', 'Small Group', 'Large Group', 'Government', 'Medicare', 'Medicaid']
        }],
        serviceAreas: [{
            state: {
                type: String,
                required: true
            },
            counties: [String],
            zipCodes: [String],
            isStatewide: {
                type: Boolean,
                default: false
            }
        }],
        planTypes: [{
            planType: {
                type: String,
                enum: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'Indemnity', 'Other'],
                required: true
            },
            description: String,
            isActive: {
                type: Boolean,
                default: true
            },
            enrollmentPeriods: [{
                startDate: Date,
                endDate: Date,
                enrollmentType: {
                    type: String,
                    enum: ['Open Enrollment', 'Special Enrollment', 'Year Round']
                }
            }]
        }],
        membershipInfo: {
            totalMembers: {
                type: Number,
                min: [0, 'Total members cannot be negative'],
                default: 0
            },
            activePlans: {
                type: Number,
                min: [0, 'Active plans cannot be negative'],
                default: 0
            },
            marketShare: {
                type: Number,
                min: [0, 'Market share cannot be negative'],
                max: [100, 'Market share cannot exceed 100%']
            }
        }
    },

    // EXISTING CLAIMS PROCESSING (PRESERVED EXACTLY)
    claimsProcessing: {
        processingModel: {
            type: String,
            enum: ['In-House', 'Outsourced', 'Hybrid'],
            default: 'In-House'
        },
        thirdPartyAdministrator: {
            name: String,
            contact: String,
            phone: String,
            email: String
        },
        claimsVolume: {
            dailyAverage: {
                type: Number,
                min: [0, 'Daily average cannot be negative'],
                default: 0
            },
            monthlyAverage: {
                type: Number,
                min: [0, 'Monthly average cannot be negative'],
                default: 0
            },
            peakVolumePeriods: [String]
        },
        processingTimes: {
            cleanClaims: {
                type: Number, // days
                default: 14
            },
            complexClaims: {
                type: Number, // days
                default: 30
            },
            appealsProcessing: {
                type: Number, // days
                default: 60
            }
        },
        paymentMethods: [{
            method: {
                type: String,
                enum: ['Check', 'ACH', 'EFT', 'Virtual Card', 'Wire Transfer'],
                required: true
            },
            isAvailable: {
                type: Boolean,
                default: true
            },
            processingTime: Number, // days
            fees: {
                type: Number,
                min: [0, 'Fees cannot be negative'],
                default: 0
            }
        }],
        qualityMetrics: {
            claimAccuracyRate: {
                type: Number,
                min: [0, 'Accuracy rate cannot be negative'],
                max: [100, 'Accuracy rate cannot exceed 100%'],
                default: 95
            },
            firstPassResolutionRate: {
                type: Number,
                min: [0, 'Resolution rate cannot be negative'],
                max: [100, 'Resolution rate cannot exceed 100%'],
                default: 85
            },
            customerSatisfactionScore: {
                type: Number,
                min: [0, 'Satisfaction score cannot be negative'],
                max: [100, 'Satisfaction score cannot exceed 100%']
            }
        }
    },

    // EXISTING PRIOR AUTHORIZATION (PRESERVED EXACTLY)
    priorAuthorization: {
        requiresPriorAuth: {
            type: Boolean,
            default: false
        },
        authorizationTypes: [{
            serviceCategory: {
                type: String,
                enum: [
                    'Specialist Referrals',
                    'Diagnostic Imaging',
                    'Surgery',
                    'DME',
                    'Home Health',
                    'Medications',
                    'Mental Health',
                    'Rehabilitation',
                    'Other'
                ],
                required: true
            },
            isRequired: {
                type: Boolean,
                default: true
            },
            processingTime: {
                type: Number, // hours
                default: 72
            },
            validityPeriod: {
                type: Number, // days
                default: 365
            },
            submissionMethods: [{
                type: String,
                enum: ['Online Portal', 'Phone', 'Fax', 'EDI', 'Mail']
            }]
        }],
        authorizationWorkflow: {
            standardReview: {
                timeframe: {
                    type: Number, // hours
                    default: 72
                },
                autoApprovalCriteria: [String]
            },
            expeditedReview: {
                timeframe: {
                    type: Number, // hours
                    default: 24
                },
                qualifyingConditions: [String]
            },
            appealProcess: {
                firstLevelTimeframe: {
                    type: Number, // days
                    default: 30
                },
                secondLevelTimeframe: {
                    type: Number, // days
                    default: 60
                },
                externalReviewAvailable: {
                    type: Boolean,
                    default: true
                }
            }
        }
    },

    // EXISTING FINANCIAL INFORMATION (PRESERVED EXACTLY)
    financialInfo: {
        financialRating: {
            amRating: String, // A.M. Best rating
            moodysRating: String,
            standardPoorRating: String,
            lastRatingUpdate: Date
        },
        financialMetrics: {
            totalAssets: {
                type: Number,
                min: [0, 'Assets cannot be negative']
            },
            totalLiabilities: {
                type: Number,
                min: [0, 'Liabilities cannot be negative']
            },
            netWorth: Number,
            annualRevenue: {
                type: Number,
                min: [0, 'Revenue cannot be negative']
            },
            profitMargin: {
                type: Number,
                min: [-100, 'Profit margin cannot be below -100%'],
                max: [100, 'Profit margin cannot exceed 100%']
            },
            medicalLossRatio: {
                type: Number,
                min: [0, 'MLR cannot be negative'],
                max: [100, 'MLR cannot exceed 100%']
            }
        },
        reportingRequirements: {
            quarterlyReports: {
                type: Boolean,
                default: true
            },
            annualReports: {
                type: Boolean,
                default: true
            },
            regulatoryFilings: [String],
            lastAuditDate: Date,
            nextAuditDate: Date
        }
    },

    // EXISTING TECHNOLOGY & INTEGRATION (PRESERVED EXACTLY)
    technologyInfo: {
        claimsSystem: {
            systemName: String,
            vendor: String,
            version: String,
            lastUpgrade: Date,
            nextUpgrade: Date
        },
        ediCapabilities: {
            supportedTransactions: [{
                transactionType: {
                    type: String,
                    enum: ['270/271', '276/277', '837P', '837I', '835', '278', '999', '997'],
                    required: true
                },
                isSupported: {
                    type: Boolean,
                    default: true
                },
                version: String,
                implementationDate: Date,
                testingRequired: {
                    type: Boolean,
                    default: true
                }
            }],
            preferredClearinghouses: [String],
            dataFormat: {
                type: String,
                enum: ['X12', 'CSV', 'Fixed Width', 'JSON', 'XML'],
                default: 'X12'
            }
        },
        apiCapabilities: {
            hasPublicApi: {
                type: Boolean,
                default: false
            },
            apiDocumentationUrl: String,
            authenticationMethod: {
                type: String,
                enum: ['API Key', 'OAuth', 'Basic Auth', 'None'],
                default: 'None'
            },
            rateLimits: String,
            sandboxAvailable: {
                type: Boolean,
                default: false
            }
        },
        integrationPreferences: {
            preferredIntegrationMethod: {
                type: String,
                enum: ['EDI', 'API', 'File Transfer', 'Manual Entry'],
                default: 'EDI'
            },
            dataExchangeFrequency: {
                type: String,
                enum: ['Real-time', 'Hourly', 'Daily', 'Weekly'],
                default: 'Daily'
            },
            securityRequirements: [String]
        }
    },

    // EDI MAPPINGS 
    ediMappings: {
        type: ediMappingsSchema,
        default: () => ({})
    },

    // SLA METRICS 
    slaMetrics: {
        type: slaMetricsSchema,
        default: () => ({})
    },

    // EXISTING RELATIONSHIPS & PARTNERSHIPS (PRESERVED EXACTLY)
    relationships: {
        providerNetworks: [{
            networkName: String,
            networkType: {
                type: String,
                enum: ['Preferred', 'Standard', 'Out-of-Network']
            },
            contractEffectiveDate: Date,
            contractExpirationDate: Date,
            reimbursementModel: {
                type: String,
                enum: ['Fee Schedule', 'Capitation', 'DRG', 'Per Diem', 'Bundled Payment']
            }
        }],
        reinsuranceCarriers: [{
            carrierName: String,
            reinsuranceType: {
                type: String,
                enum: ['Quota Share', 'Surplus', 'Excess of Loss', 'Catastrophic']
            },
            retentionLimit: Number,
            effectiveDate: Date,
            expirationDate: Date
        }],
        businessPartners: [{
            partnerName: String,
            partnerType: {
                type: String,
                enum: ['Broker', 'TPA', 'PBM', 'Wellness Provider', 'Technology Vendor']
            },
            serviceProvided: String,
            contractStatus: {
                type: String,
                enum: ['Active', 'Pending', 'Expired', 'Terminated'],
                default: 'Active'
            }
        }]
    },

    // EXISTING COMPLIANCE & REGULATION (PRESERVED EXACTLY)
    complianceInfo: {
        regulatoryBody: [{
            regulatorName: String,
            jurisdiction: String,
            licenseNumber: String,
            licenseExpirationDate: Date,
            complianceStatus: {
                type: String,
                enum: ['Compliant', 'Non-Compliant', 'Under Review'],
                default: 'Compliant'
            }
        }],
        accreditations: [{
            accreditingBody: {
                type: String,
                enum: ['NCQA', 'URAC', 'AAAHC', 'JCI', 'Other']
            },
            accreditationType: String,
            accreditationDate: Date,
            expirationDate: Date,
            status: {
                type: String,
                enum: ['Current', 'Expired', 'Pending', 'Denied'],
                default: 'Current'
            }
        }],
        hipaaCompliance: {
            baaSigned: {
                type: Boolean,
                default: false
            },
            baaSignedDate: Date,
            baaExpirationDate: Date,
            lastAuditDate: Date,
            nextAuditDate: Date,
            complianceOfficer: String
        }
    },

    // EXISTING STATUS & METADATA (PRESERVED EXACTLY)
    status: {
        payerStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Suspended', 'Under Review'],
            default: 'Active',
            index: true
        },
        lastStatusUpdate: {
            type: Date,
            default: Date.now
        },
        statusReason: String,
        credentialingStatus: {
            type: String,
            enum: ['Credentialed', 'In Process', 'Denied', 'Expired', 'Not Required'],
            default: 'In Process'
        },
        contractStatus: {
            type: String,
            enum: ['Contracted', 'Non-Contracted', 'Pending', 'Expired'],
            default: 'Pending'
        },
        relationshipQuality: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Unknown'],
            default: 'Unknown'
        }
    },

    // EXISTING SYSTEM INFO (PRESERVED EXACTLY)
    systemInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        lastModifiedAt: Date,
        dataSource: {
            type: String,
            enum: ['Manual Entry', 'Import', 'API', 'Third Party'],
            default: 'Manual Entry'
        },
        lastDataUpdate: Date,
        dataQualityScore: {
            type: Number,
            min: [0, 'Quality score cannot be negative'],
            max: [100, 'Quality score cannot exceed 100%'],
            default: 80
        }
    },

    // EXISTING AUDIT INFO (PRESERVED EXACTLY)
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
        changeHistory: [{
            modifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            modifiedAt: {
                type: Date,
                default: Date.now
            },
            changeType: {
                type: String,
                enum: ['Created', 'Updated', 'Status Changed', 'Archived'],
                required: true
            },
            changedFields: [String],
            oldValues: mongoose.Schema.Types.Mixed,
            newValues: mongoose.Schema.Types.Mixed,
            reason: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// EXISTING INDEXES (PRESERVED) + INDEXES
payerSchema.index({ companyRef: 1, 'systemInfo.isActive': 1 });
payerSchema.index({ 'payerInfo.payerName': 1 });
payerSchema.index({ 'payerInfo.payerType': 1 });
payerSchema.index({ 'identifiers.payerIdNumber': 1 });
payerSchema.index({ 'identifiers.x12PayerId': 1 });
payerSchema.index({ 'status.payerStatus': 1 });
payerSchema.index({ 'coverageInfo.serviceAreas.state': 1 });
// RCM INDEXES
payerSchema.index({ 'ediMappings.clearinghouseMappings.clearinghouseName': 1 });
payerSchema.index({ 'slaMetrics.overallMetrics.responseTimeCompliance': 1 });
payerSchema.index({ 'slaMetrics.transactionMetrics.transactionType': 1 });

// EXISTING VIRTUAL FIELDS (PRESERVED)
payerSchema.virtual('displayName').get(function () {
    return this.payerInfo.legalName || this.payerInfo.payerName;
});

payerSchema.virtual('isActive').get(function () {
    return this.systemInfo.isActive && this.status.payerStatus === 'Active';
});

payerSchema.virtual('primaryContact').get(function () {
    return this.contactInfo.primaryContact;
});

payerSchema.virtual('totalServiceAreas').get(function () {
    return this.coverageInfo.serviceAreas?.length || 0;
});

payerSchema.virtual('activePlanTypes').get(function () {
    return this.coverageInfo.planTypes?.filter(plan => plan.isActive) || [];
});

// RCM VIRTUAL FIELDS 
payerSchema.virtual('activeClearinghouses').get(function () {
    return this.ediMappings?.clearinghouseMappings?.filter(ch => ch.isActive) || [];
});

payerSchema.virtual('overallSlaCompliance').get(function () {
    return this.slaMetrics?.overallMetrics?.responseTimeCompliance || 0;
});

payerSchema.virtual('slaStatus').get(function () {
    const compliance = this.overallSlaCompliance;
    if (compliance >= 95) return 'Excellent';
    if (compliance >= 90) return 'Good';
    if (compliance >= 80) return 'Fair';
    if (compliance >= 70) return 'Poor';
    return 'Critical';
});

payerSchema.virtual('supportedTransactions').get(function () {
    return this.technologyInfo?.ediCapabilities?.supportedTransactions?.filter(t => t.isSupported) || [];
});

// EXISTING STATIC METHODS (PRESERVED)
payerSchema.statics.findActivePayers = function (companyRef) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'status.payerStatus': 'Active'
    }).sort({ 'payerInfo.payerName': 1 });
};

payerSchema.statics.findByPayerType = function (companyRef, payerType) {
    return this.find({
        companyRef,
        'payerInfo.payerType': payerType,
        'systemInfo.isActive': true
    });
};

payerSchema.statics.findByServiceArea = function (companyRef, state) {
    return this.find({
        companyRef,
        'coverageInfo.serviceAreas.state': state,
        'systemInfo.isActive': true
    });
};

payerSchema.statics.findContractedPayers = function (companyRef) {
    return this.find({
        companyRef,
        'status.contractStatus': 'Contracted',
        'systemInfo.isActive': true
    });
};

// RCM STATIC METHODS 
payerSchema.statics.findByClearinghouse = function (companyRef, clearinghouseName) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'ediMappings.clearinghouseMappings.clearinghouseName': clearinghouseName,
        'ediMappings.clearinghouseMappings.isActive': true
    });
};

payerSchema.statics.findWithSlaIssues = function (companyRef, complianceThreshold = 90) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'slaMetrics.overallMetrics.responseTimeCompliance': { $lt: complianceThreshold }
    });
};

payerSchema.statics.findSupportingTransaction = function (companyRef, transactionType) {
    return this.find({
        companyRef,
        'systemInfo.isActive': true,
        'technologyInfo.ediCapabilities.supportedTransactions': {
            $elemMatch: {
                transactionType: transactionType,
                isSupported: true
            }
        }
    });
};

// EXISTING INSTANCE METHODS (PRESERVED)
payerSchema.methods.isPayerActive = function () {
    return this.systemInfo.isActive && this.status.payerStatus === 'Active';
};

payerSchema.methods.supportsTransaction = function (transactionType) {
    return this.technologyInfo?.ediCapabilities?.supportedTransactions?.some(
        t => t.transactionType === transactionType && t.isSupported
    );
};

payerSchema.methods.getServiceAreasByState = function (state) {
    return this.coverageInfo?.serviceAreas?.filter(area => area.state === state) || [];
};

payerSchema.methods.isCredentialed = function () {
    return this.status.credentialingStatus === 'Credentialed';
};

// RCM INSTANCE METHODS 
payerSchema.methods.getClearinghouseMapping = function (clearinghouseName) {
    return this.ediMappings?.clearinghouseMappings?.find(
        ch => ch.clearinghouseName === clearinghouseName && ch.isActive
    );
};

payerSchema.methods.updateSlaMetrics = function (transactionType, performanceData) {
    if (!this.slaMetrics) this.slaMetrics = {};
    if (!this.slaMetrics.transactionMetrics) this.slaMetrics.transactionMetrics = [];

    let metric = this.slaMetrics.transactionMetrics.find(m => m.transactionType === transactionType);
    if (!metric) {
        metric = { transactionType, currentPerformance: {} };
        this.slaMetrics.transactionMetrics.push(metric);
    }

    Object.assign(metric.currentPerformance, performanceData);
    metric.lastMeasured = new Date();

    // Update compliance status based on performance
    const slaTarget = metric.slaTarget;
    if (slaTarget && metric.currentPerformance) {
        const perf = metric.currentPerformance;
        const responseTimeCompliant = !slaTarget.responseTime || perf.averageResponseTime <= slaTarget.responseTime;
        const successRateCompliant = !slaTarget.successRate || perf.successRate >= slaTarget.successRate;
        const availabilityCompliant = !slaTarget.availability || perf.availability >= slaTarget.availability;

        if (responseTimeCompliant && successRateCompliant && availabilityCompliant) {
            metric.complianceStatus = 'Compliant';
        } else if (!responseTimeCompliant || !successRateCompliant || !availabilityCompliant) {
            metric.complianceStatus = 'Non-Compliant';
        } else {
            metric.complianceStatus = 'At Risk';
        }
    }

    return metric;
};

payerSchema.methods.addEdiMapping = function (clearinghouseName, mappingData) {
    if (!this.ediMappings) this.ediMappings = {};
    if (!this.ediMappings.clearinghouseMappings) this.ediMappings.clearinghouseMappings = [];

    const existingMapping = this.ediMappings.clearinghouseMappings.find(
        m => m.clearinghouseName === clearinghouseName
    );

    if (existingMapping) {
        Object.assign(existingMapping, mappingData);
        existingMapping.lastUpdated = new Date();
        return existingMapping;
    } else {
        const newMapping = {
            clearinghouseName,
            ...mappingData,
            lastUpdated: new Date()
        };
        this.ediMappings.clearinghouseMappings.push(newMapping);
        return newMapping;
    }
};

// PLUGINS
payerSchema.plugin(scopedIdPlugin, {
    idField: 'payerId',
    prefix: 'PAY',
    companyRefPath: 'companyRef'
});

// EXISTING PRE-SAVE MIDDLEWARE (PRESERVED + NEW)
payerSchema.pre('save', function (next) {
    // Update lastModifiedAt if document was modified
    if (this.isModified() && !this.isNew) {
        this.systemInfo.lastModifiedAt = new Date();
    }

    // Calculate data quality score based on completeness
    if (this.isModified()) {
        let completedFields = 0;
        let totalFields = 0;

        // Check required fields
        const requiredFields = [
            'payerInfo.payerName',
            'payerInfo.payerType',
            'contactInfo.primaryContact.phone',
            'addressInfo.corporateHeadquarters.city',
            'addressInfo.corporateHeadquarters.state'
        ];

        requiredFields.forEach(field => {
            totalFields++;
            const value = field.split('.').reduce((obj, key) => obj && obj[key], this);
            if (value) completedFields++;
        });

        this.systemInfo.dataQualityScore = Math.round((completedFields / totalFields) * 100);
    }

    // Update overall SLA metrics based on transaction metrics
    if (this.slaMetrics?.transactionMetrics?.length > 0) {
        const metrics = this.slaMetrics.transactionMetrics;
        const totalCompliance = metrics.reduce((sum, m) => {
            const compliance = m.complianceStatus === 'Compliant' ? 100 :
                m.complianceStatus === 'At Risk' ? 75 : 50;
            return sum + compliance;
        }, 0);

        this.slaMetrics.overallMetrics.responseTimeCompliance = Math.round(totalCompliance / metrics.length);
        this.slaMetrics.overallMetrics.lastUpdated = new Date();
    }

    next();
});

// EXISTING POST-SAVE MIDDLEWARE (PRESERVED)
payerSchema.post('save', function (doc, next) {
    // Could trigger SLA monitoring, data sync, etc.
    next();
});

export const Payer = mongoose.model('Payer', payerSchema, 'payers');