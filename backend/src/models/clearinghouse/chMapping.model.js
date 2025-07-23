// backend/src/models/clearinghouse/chMapping.model.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { CLEARINGHOUSE_CONSTANTS, EDI_CONSTANTS, GAMIFICATION } from '../../utils/constants.js';
import { scopedIdPlugin } from '../../plugins/scopedIdPlugin.js';

const chMappingSchema = new mongoose.Schema({
    // ** UNIQUE IDENTIFIERS **
    mappingId: {
        type: String,
        unique: true,
        // default: () => `MAP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        immutable: true,
        index: true
    },

    // ** CORE RELATIONSHIPS **
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },

    clearinghouseRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clearinghouse',
        required: [true, 'Clearinghouse reference is required'],
        index: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Created by employee is required']
    },

    // ** MAPPING IDENTIFICATION **
    mappingInfo: {
        mappingName: {
            type: String,
            required: [true, 'Mapping name is required'],
            trim: true,
            maxlength: [100, 'Mapping name cannot exceed 100 characters']
        },
        mappingType: {
            type: String,
            required: [true, 'Mapping type is required'],
            enum: {
                values: [
                    'FIELD_MAPPING', 'CODE_MAPPING', 'FORMAT_TRANSFORMATION',
                    'VALIDATION_RULES', 'BUSINESS_LOGIC', 'DATA_ENRICHMENT'
                ],
                message: 'Invalid mapping type'
            },
            index: true
        },
        mappingCategory: {
            type: String,
            required: [true, 'Mapping category is required'],
            enum: {
                values: [
                    'PATIENT_DEMOGRAPHICS', 'PROVIDER_INFO', 'INSURANCE_INFO',
                    'CLAIM_DATA', 'DIAGNOSIS_CODES', 'PROCEDURE_CODES',
                    'MODIFIERS', 'PLACE_OF_SERVICE', 'TYPE_OF_SERVICE',
                    'REVENUE_CODES', 'ADJUSTMENT_CODES', 'REMITTANCE_DATA'
                ],
                message: 'Invalid mapping category'
            },
            index: true
        },
        ediType: {
            type: String,
            enum: {
                values: Object.values(EDI_CONSTANTS.EDI_TYPES),
                message: 'Invalid EDI type'
            },
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        }
    },

    // ** SOURCE & TARGET CONFIGURATION **
    sourceConfig: {
        systemType: {
            type: String,
            required: [true, 'Source system type is required'],
            enum: {
                values: [
                    'INTERNAL', 'PMS', 'EHR', 'BILLING_SYSTEM',
                    'CLEARINGHOUSE', 'PAYER', 'THIRD_PARTY'
                ],
                message: 'Invalid source system type'
            }
        },
        systemName: {
            type: String,
            required: [true, 'Source system name is required'],
            trim: true,
            maxlength: [100, 'Source system name cannot exceed 100 characters']
        },
        dataFormat: {
            type: String,
            required: [true, 'Source data format is required'],
            enum: {
                values: ['JSON', 'XML', 'CSV', 'EXCEL', 'EDI_X12', 'HL7', 'FIXED_WIDTH', 'DELIMITED'],
                message: 'Invalid source data format'
            }
        },
        fieldPath: {
            type: String,
            trim: true,
            maxlength: [200, 'Source field path cannot exceed 200 characters']
        },
        fieldName: {
            type: String,
            required: [true, 'Source field name is required'],
            trim: true,
            maxlength: [100, 'Source field name cannot exceed 100 characters']
        },
        dataType: {
            type: String,
            required: [true, 'Source data type is required'],
            enum: {
                values: ['STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'ARRAY', 'OBJECT', 'DECIMAL'],
                message: 'Invalid source data type'
            }
        }
    },

    targetConfig: {
        systemType: {
            type: String,
            required: [true, 'Target system type is required'],
            enum: {
                values: [
                    'INTERNAL', 'PMS', 'EHR', 'BILLING_SYSTEM',
                    'CLEARINGHOUSE', 'PAYER', 'THIRD_PARTY'
                ],
                message: 'Invalid target system type'
            }
        },
        systemName: {
            type: String,
            required: [true, 'Target system name is required'],
            trim: true,
            maxlength: [100, 'Target system name cannot exceed 100 characters']
        },
        dataFormat: {
            type: String,
            required: [true, 'Target data format is required'],
            enum: {
                values: ['JSON', 'XML', 'CSV', 'EXCEL', 'EDI_X12', 'HL7', 'FIXED_WIDTH', 'DELIMITED'],
                message: 'Invalid target data format'
            }
        },
        fieldPath: {
            type: String,
            trim: true,
            maxlength: [200, 'Target field path cannot exceed 200 characters']
        },
        fieldName: {
            type: String,
            required: [true, 'Target field name is required'],
            trim: true,
            maxlength: [100, 'Target field name cannot exceed 100 characters']
        },
        dataType: {
            type: String,
            required: [true, 'Target data type is required'],
            enum: {
                values: ['STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'ARRAY', 'OBJECT', 'DECIMAL'],
                message: 'Invalid target data type'
            }
        }
    },

    // ** TRANSFORMATION RULES **
    transformationRules: {
        transformationType: {
            type: String,
            required: [true, 'Transformation type is required'],
            enum: {
                values: [
                    'DIRECT_MAP', 'VALUE_LOOKUP', 'CONDITIONAL', 'CALCULATION',
                    'CONCATENATION', 'SPLIT', 'FORMAT_CHANGE', 'VALIDATION',
                    'DEFAULT_VALUE', 'CUSTOM_FUNCTION'
                ],
                message: 'Invalid transformation type'
            }
        },

        // Direct Mapping
        directMapping: {
            sourceField: String,
            targetField: String,
            required: {
                type: Boolean,
                default: false
            }
        },

        // Value Lookup Tables
        valueLookups: [{
            sourceValue: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            },
            targetValue: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            },
            description: String,
            isDefault: {
                type: Boolean,
                default: false
            }
        }],

        // Conditional Mappings
        conditionalRules: [{
            condition: {
                field: {
                    type: String,
                    required: true
                },
                operator: {
                    type: String,
                    enum: ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'NOT_CONTAINS', 'GREATER_THAN', 'LESS_THAN', 'IS_EMPTY', 'IS_NOT_EMPTY'],
                    required: true
                },
                value: mongoose.Schema.Types.Mixed
            },
            action: {
                type: {
                    type: String,
                    enum: ['SET_VALUE', 'COPY_FIELD', 'CALCULATE', 'REJECT', 'DEFAULT'],
                    required: true
                },
                value: mongoose.Schema.Types.Mixed
            }
        }],

        // Calculation Rules
        calculationRules: {
            formula: String,
            variables: [{
                name: String,
                sourceField: String,
                dataType: String,
                defaultValue: mongoose.Schema.Types.Mixed
            }],
            resultType: {
                type: String,
                enum: ['NUMBER', 'STRING', 'DATE', 'BOOLEAN']
            }
        },

        // Format Transformations
        formatRules: {
            inputFormat: String,
            outputFormat: String,
            dateFormats: {
                inputFormat: String,
                outputFormat: String,
                timezone: String
            },
            numberFormats: {
                decimalPlaces: Number,
                thousandsSeparator: String,
                decimalSeparator: String,
                currencySymbol: String
            },
            stringFormats: {
                case: {
                    type: String,
                    enum: ['UPPER', 'LOWER', 'TITLE', 'SENTENCE']
                },
                trim: {
                    type: Boolean,
                    default: true
                },
                padLeft: Number,
                padRight: Number,
                padCharacter: String
            }
        },

        // Default Values
        defaultValues: {
            whenEmpty: mongoose.Schema.Types.Mixed,
            whenNull: mongoose.Schema.Types.Mixed,
            whenError: mongoose.Schema.Types.Mixed
        },

        // Custom Functions
        customFunction: {
            functionName: String,
            parameters: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            returnType: String,
            description: String
        }
    },

    // ** VALIDATION RULES **
    validationRules: {
        isRequired: {
            type: Boolean,
            default: false
        },
        minLength: Number,
        maxLength: Number,
        minValue: Number,
        maxValue: Number,
        pattern: String, // Regex pattern
        allowedValues: [mongoose.Schema.Types.Mixed],
        customValidation: {
            functionName: String,
            parameters: {
                type: Map,
                of: mongoose.Schema.Types.Mixed
            },
            errorMessage: String
        },

        // EDI Specific Validations
        ediValidations: {
            segmentId: String,
            elementPosition: Number,
            componentPosition: Number,
            dataElementNumber: String,
            minimumLength: Number,
            maximumLength: Number,
            dataType: {
                type: String,
                enum: ['AN', 'DT', 'TM', 'N0', 'N2', 'R', 'ID', 'B']
            }
        }
    },

    // ** ERROR HANDLING **
    errorHandling: {
        onValidationError: {
            type: String,
            enum: ['REJECT', 'LOG_AND_CONTINUE', 'USE_DEFAULT', 'SKIP_FIELD'],
            default: 'REJECT'
        },
        onTransformationError: {
            type: String,
            enum: ['REJECT', 'LOG_AND_CONTINUE', 'USE_DEFAULT', 'SKIP_FIELD'],
            default: 'REJECT'
        },
        errorNotifications: [{
            type: {
                type: String,
                enum: ['EMAIL', 'SMS', 'IN_APP', 'WEBHOOK'],
                default: 'IN_APP'
            },
            recipients: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }],
            severity: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                default: 'MEDIUM'
            }
        }]
    },

    // ** PERFORMANCE TRACKING **
    performanceMetrics: {
        totalTransformations: {
            type: Number,
            default: 0,
            min: [0, 'Total transformations cannot be negative']
        },
        successfulTransformations: {
            type: Number,
            default: 0,
            min: [0, 'Successful transformations cannot be negative']
        },
        failedTransformations: {
            type: Number,
            default: 0,
            min: [0, 'Failed transformations cannot be negative']
        },
        averageProcessingTime: {
            type: Number,
            min: [0, 'Average processing time cannot be negative']
        },
        lastExecuted: Date,
        lastSuccessful: Date,
        lastFailed: Date
    },

    // ** TESTING & VALIDATION **
    testingData: {
        sampleInputs: [{
            description: String,
            inputData: mongoose.Schema.Types.Mixed,
            expectedOutput: mongoose.Schema.Types.Mixed,
            testResult: {
                type: String,
                enum: ['PASS', 'FAIL', 'NOT_TESTED']
            },
            actualOutput: mongoose.Schema.Types.Mixed,
            testDate: Date,
            testedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        validationTests: [{
            testName: String,
            testType: {
                type: String,
                enum: ['UNIT_TEST', 'INTEGRATION_TEST', 'REGRESSION_TEST']
            },
            testStatus: {
                type: String,
                enum: ['PENDING', 'RUNNING', 'PASSED', 'FAILED'],
                default: 'PENDING'
            },
            lastRun: Date,
            results: {
                passed: Number,
                failed: Number,
                errors: [String]
            }
        }]
    },

    // ** VERSION CONTROL **
    versionInfo: {
        version: {
            type: String,
            required: [true, 'Version is required'],
            default: '1.0.0'
        },
        versionHistory: [{
            version: {
                type: String,
                required: true
            },
            changes: {
                type: String,
                required: true
            },
            changedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
                required: true
            },
            changeDate: {
                type: Date,
                required: true,
                default: Date.now
            },
            isActive: {
                type: Boolean,
                default: false
            }
        }],
        parentMappingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CHMapping'
        }
    },

    // ** STATUS & LIFECYCLE **
    statusInfo: {
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        isDeprecated: {
            type: Boolean,
            default: false
        },
        deprecationReason: String,
        deprecatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        deprecatedAt: Date,
        activatedAt: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ** INDEXES FOR OPTIMAL PERFORMANCE **
chMappingSchema.index({ companyRef: 1, clearinghouseRef: 1 });
chMappingSchema.index({ 'mappingInfo.mappingType': 1, 'statusInfo.isActive': 1 });
chMappingSchema.index({ 'mappingInfo.mappingCategory': 1, 'mappingInfo.ediType': 1 });
chMappingSchema.index({ 'sourceConfig.systemType': 1, 'targetConfig.systemType': 1 });
chMappingSchema.index({ 'versionInfo.version': 1, 'statusInfo.isActive': 1 });
chMappingSchema.index({ createdBy: 1, createdAt: -1 });

// ** VIRTUAL FIELDS **
chMappingSchema.virtual('successRate').get(function () {
    if (this.performanceMetrics?.totalTransformations === 0) return 0;
    return Math.round(
        (this.performanceMetrics.successfulTransformations / this.performanceMetrics.totalTransformations) * 100
    );
});

chMappingSchema.virtual('failureRate').get(function () {
    if (this.performanceMetrics?.totalTransformations === 0) return 0;
    return Math.round(
        (this.performanceMetrics.failedTransformations / this.performanceMetrics.totalTransformations) * 100
    );
});

chMappingSchema.virtual('isHealthy').get(function () {
    return this.statusInfo?.isActive &&
        !this.statusInfo?.isDeprecated &&
        this.successRate >= 95;
});

chMappingSchema.virtual('needsAttention').get(function () {
    return this.successRate < 90 ||
        (this.performanceMetrics?.averageProcessingTime > 5000) ||
        (this.performanceMetrics?.failedTransformations > 10);
});

// ** MIDDLEWARE **

// Pre-save middleware for version control and validation
chMappingSchema.pre('save', function (next) {
    // Update last modified timestamp
    this.statusInfo.lastModified = new Date();

    // Validate transformation rules consistency
    if (this.transformationRules?.transformationType === 'VALUE_LOOKUP' &&
        (!this.transformationRules.valueLookups || this.transformationRules.valueLookups.length === 0)) {
        next(new Error('Value lookup transformation requires lookup values'));
        return;
    }

    // Validate source and target data type compatibility
    if (this.sourceConfig?.dataType && this.targetConfig?.dataType) {
        const incompatibleTypes = {
            'STRING': ['NUMBER', 'DECIMAL'],
            'NUMBER': ['DATE', 'BOOLEAN'],
            'DATE': ['NUMBER', 'BOOLEAN'],
            'BOOLEAN': ['DATE', 'DECIMAL']
        };

        if (incompatibleTypes[this.sourceConfig.dataType]?.includes(this.targetConfig.dataType) &&
            this.transformationRules?.transformationType === 'DIRECT_MAP') {
            console.warn(`Potentially incompatible data types: ${this.sourceConfig.dataType} -> ${this.targetConfig.dataType}`);
        }
    }

    next();
});

// Post-save middleware for notifications and performance tracking
chMappingSchema.post('save', async function (doc) {
    try {
        // Award XP for creating or updating mappings
        if (doc.isNew || doc.isModified('transformationRules')) {
            const Employee = mongoose.model('Employee');
            await Employee.findByIdAndUpdate(
                doc.createdBy,
                {
                    $inc: {
                        'gamification.experience.totalXP': GAMIFICATION.XP_REWARDS.PROCESS_IMPROVEMENT
                    }
                }
            );
        }

        // Create notification for mapping errors
        if (doc.needsAttention && doc.isModified('performanceMetrics')) {
            const Notification = mongoose.model('Notification');
            await Notification.create({
                companyRef: doc.companyRef,
                recipientRef: doc.createdBy,
                type: 'MAPPING_ALERT',
                title: 'Mapping Performance Issue',
                message: `Mapping ${doc.mappingInfo.mappingName} needs attention - Success Rate: ${doc.successRate}%`,
                priority: 'MEDIUM',
                relatedEntity: {
                    entityType: 'CHMapping',
                    entityId: doc._id
                }
            });
        }

    } catch (error) {
        console.error('Post-save middleware error:', error);
    }
});

// ** STATIC METHODS **

// Find mappings by clearinghouse and category
chMappingSchema.statics.findByClearinghouseAndCategory = function (clearinghouseId, category) {
    return this.find({
        clearinghouseRef: clearinghouseId,
        'mappingInfo.mappingCategory': category,
        'statusInfo.isActive': true
    }).populate('createdBy', 'firstName lastName');
};

// Get transformation statistics
chMappingSchema.statics.getTransformationStats = function (companyId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                companyRef: new mongoose.Types.ObjectId(companyId),
                'performanceMetrics.lastExecuted': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$mappingInfo.mappingCategory',
                totalMappings: { $sum: 1 },
                totalTransformations: { $sum: '$performanceMetrics.totalTransformations' },
                successfulTransformations: { $sum: '$performanceMetrics.successfulTransformations' },
                failedTransformations: { $sum: '$performanceMetrics.failedTransformations' },
                avgProcessingTime: { $avg: '$performanceMetrics.averageProcessingTime' }
            }
        },
        {
            $project: {
                category: '$_id',
                totalMappings: 1,
                totalTransformations: 1,
                successfulTransformations: 1,
                failedTransformations: 1,
                successRate: {
                    $round: [
                        {
                            $multiply: [
                                { $divide: ['$successfulTransformations', '$totalTransformations'] },
                                100
                            ]
                        },
                        2
                    ]
                },
                avgProcessingTimeSeconds: {
                    $round: [{ $divide: ['$avgProcessingTime', 1000] }, 3]
                }
            }
        }
    ]);
};

// Find problematic mappings
chMappingSchema.statics.findProblematicMappings = function (companyId) {
    return this.find({
        companyRef: companyId,
        'statusInfo.isActive': true,
        $or: [
            { 'performanceMetrics.failedTransformations': { $gt: 10 } },
            { 'performanceMetrics.averageProcessingTime': { $gt: 5000 } },
            {
                $expr: {
                    $lt: [
                        {
                            $divide: [
                                '$performanceMetrics.successfulTransformations',
                                '$performanceMetrics.totalTransformations'
                            ]
                        },
                        0.9
                    ]
                }
            }
        ]
    }).populate('clearinghouseRef createdBy');
};

// ** INSTANCE METHODS **

// Apply transformation to data
chMappingSchema.methods.applyTransformation = function (inputData) {
    const startTime = Date.now();

    try {
        let result = inputData;

        // Apply transformation based on type
        switch (this.transformationRules?.transformationType) {
            case 'DIRECT_MAP':
                result = this._applyDirectMapping(inputData);
                break;
            case 'VALUE_LOOKUP':
                result = this._applyValueLookup(inputData);
                break;
            case 'CONDITIONAL':
                result = this._applyConditionalMapping(inputData);
                break;
            case 'CALCULATION':
                result = this._applyCalculation(inputData);
                break;
            case 'FORMAT_CHANGE':
                result = this._applyFormatChange(inputData);
                break;
            default:
                throw new Error(`Unsupported transformation type: ${this.transformationRules?.transformationType}`);
        }

        // Update performance metrics
        this.performanceMetrics.totalTransformations += 1;
        this.performanceMetrics.successfulTransformations += 1;
        this.performanceMetrics.lastExecuted = new Date();
        this.performanceMetrics.lastSuccessful = new Date();

        const processingTime = Date.now() - startTime;
        this.performanceMetrics.averageProcessingTime =
            (this.performanceMetrics.averageProcessingTime || 0 + processingTime) / 2;

        return result;

    } catch (error) {
        // Update failure metrics
        this.performanceMetrics.totalTransformations += 1;
        this.performanceMetrics.failedTransformations += 1;
        this.performanceMetrics.lastExecuted = new Date();
        this.performanceMetrics.lastFailed = new Date();

        throw error;
    }
};

// Private transformation helper methods
chMappingSchema.methods._applyDirectMapping = function (inputData) {
    const sourceField = this.transformationRules?.directMapping?.sourceField;
    const targetField = this.transformationRules?.directMapping?.targetField;

    if (!sourceField || !targetField) {
        throw new Error('Direct mapping requires source and target fields');
    }

    return { [targetField]: inputData[sourceField] };
};

chMappingSchema.methods._applyValueLookup = function (inputData) {
    const sourceValue = inputData[this.sourceConfig.fieldName];
    const lookup = this.transformationRules.valueLookups?.find(
        lookup => lookup.sourceValue === sourceValue
    );

    if (lookup) {
        return lookup.targetValue;
    }

    // Use default if available
    const defaultLookup = this.transformationRules.valueLookups?.find(
        lookup => lookup.isDefault
    );

    if (defaultLookup) {
        return defaultLookup.targetValue;
    }

    throw new Error(`No lookup found for value: ${sourceValue}`);
};

// Test mapping with sample data
chMappingSchema.methods.runTest = function (inputData, expectedOutput) {
    try {
        const actualOutput = this.applyTransformation(inputData);
        const testResult = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput) ? 'PASS' : 'FAIL';

        this.testingData.sampleInputs.push({
            description: 'Runtime test',
            inputData,
            expectedOutput,
            actualOutput,
            testResult,
            testDate: new Date()
        });

        return { testResult, actualOutput };

    } catch (error) {
        this.testingData.sampleInputs.push({
            description: 'Runtime test',
            inputData,
            expectedOutput,
            testResult: 'FAIL',
            actualOutput: { error: error.message },
            testDate: new Date()
        });

        return { testResult: 'FAIL', error: error.message };
    }
};

chMappingSchema.plugin(scopedIdPlugin, {
    idField: 'mappingId',
    prefix: 'CHM',
    companyRefPath: 'companyRef',
});

export const CHMapping = mongoose.model('CHMapping', chMappingSchema, 'chMappings');