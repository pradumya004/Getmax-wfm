// backend/src/models/subdepartment.model.js

import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const subdepartmentSchema = new mongoose.Schema({
    subdepartmentId: {
        type: String,
        unique: true,
        default: () => `SUBDEPT-${uuidv4().substring(0, 8).toUpperCase()}`,
        trim: true,
        immutable: true,
    },
    companyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required'],
        index: true
    },
    departmentRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department reference is required'],
        index: true
    },

    // Subdepartment Information
    subdepartmentName: {
        type: String,
        required: [true, 'Subdepartment name is required'],
        trim: true,
        maxlength: [100, 'Subdepartment name cannot exceed 100 characters']
    },
    subdepartmentCode: {
        type: String,
        required: [true, 'Subdepartment code is required'],
        trim: true,
        uppercase: true,
        maxlength: [15, 'Subdepartment code cannot exceed 15 characters']
    },
    subdepartmentDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Leadership Structure
    subdepartmentHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null
    },

    // Operational Classification
    functionType: {
        type: String,
        enum: ["Operational", "Support", "Administrative", "Technical", "Quality", "Training", "Research", "Development"],
        default: "Operational"
    },
    workType: {
        type: String,
        enum: ["Production", "Support", "Quality Control", "Training", "Administrative", "Research"],
        default: "Production"
    },

    // Resource Management
    costCenter: {
        type: String,
        trim: true
    },
    budget: {
        allocated: {
            type: Number,
            min: 0,
            default: 0
        },
        currency: {
            type: String,
            default: "USD",
            enum: ["USD", "INR", "EUR", "GBP", "CAD"]
        }
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },

    // Capacity Management
    employeeCapacity: {
        current: {
            type: Number,
            default: 0,
            min: [0, 'Current employee count cannot be negative']
        },
        maximum: {
            type: Number,
            default: null,
            min: [0, 'Maximum capacity cannot be negative'],
            validate: {
                validator: function (v) {
                    return v === null || v >= this.employeeCapacity.current;
                },
                message: 'Maximum capacity must be greater than or equal to current capacity'
            }
        }
    },

    // Performance Targets
    performanceTargets: {
        dailyClaimTarget: {
            type: Number,
            default: null,
            min: [0, 'Daily claim target cannot be negative']
        },
        qualityTarget: {
            type: Number,
            min: [0, 'Quality target cannot be negative'],
            max: [100, 'Quality target cannot exceed 100%'],
            default: null
        },
        productivityTarget: {
            type: Number,
            min: [0, 'Productivity target cannot be negative'],
            default: null
        }
    },

    // Work Schedule
    operationalHours: {
        startTime: {
            type: String,
            default: "09:00",
            validate: {
                validator: function (v) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: 'Start time must be in HH:MM format (24-hour)'
            }
        },
        endTime: {
            type: String,
            default: "17:00",
            validate: {
                validator: function (v) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: 'End time must be in HH:MM format (24-hour)'
            }
        },
        workingDays: {
            type: [String],
            enum: {
                values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                message: 'Working days must be valid day names'
            },
            default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one working day must be specified'
            }
        },
        timeZone: {
            type: String,
            enum: {
                values: ["EST", "CST", "MST", "PST", "GMT", "IST"],
                message: 'Time zone must be one of: EST, CST, MST, PST, GMT, IST'
            },
            default: "EST"
        }
    },

    // Status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isSystemDefault: {
        type: Boolean,
        default: false
    },
    requiresSpecialAccess: {
        type: Boolean,
        default: false
    },

    // Audit Trail
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    archivedAt: {
        type: Date,
        default: null
    },
    archivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
// subdepartmentSchema.index({ subdepartmentId: 1 }, { unique: true });
subdepartmentSchema.index({ companyRef: 1, departmentRef: 1, subdepartmentCode: 1 }, { unique: true });
subdepartmentSchema.index({ companyRef: 1, isActive: 1 });
subdepartmentSchema.index({ departmentRef: 1, isActive: 1 });
subdepartmentSchema.index({ subdepartmentHead: 1 });
subdepartmentSchema.index({ teamLead: 1 });

// Virtuals
subdepartmentSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'subdepartmentRef'
});

subdepartmentSchema.virtual('workingHoursPerDay').get(function () {
    const start = this.operationalHours.startTime.split(':');
    const end = this.operationalHours.endTime.split(':');

    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);

    return Math.max(0, (endMinutes - startMinutes) / 60);
});

subdepartmentSchema.virtual('weeklyWorkingHours').get(function () {
    return this.workingHoursPerDay * this.operationalHours.workingDays.length;
});

// Instance Methods
subdepartmentSchema.methods.updateEmployeeCount = async function () {
    try {
        if (mongoose.models.Employee) {
            const Employee = mongoose.model('Employee');
            const count = await Employee.countDocuments({
                subdepartmentRef: this._id
            });
            this.employeeCapacity.current = count;
            return this.save();
        }
        return this;
    } catch (error) {
        console.error('Error updating employee count:', error);
        throw error;
    }
};

subdepartmentSchema.methods.getFullPath = async function () {
    try {
        await this.populate('departmentRef', 'departmentName departmentPath');
        const departmentPath = this.departmentRef?.departmentPath || this.departmentRef?.departmentName || 'Unknown Department';
        return `${departmentPath} / ${this.subdepartmentName}`;
    } catch (error) {
        console.error('Error getting full path:', error);
        return this.subdepartmentName;
    }
};

subdepartmentSchema.methods.canBeDeleted = async function () {
    try {
        if (mongoose.models.Employee) {
            const Employee = mongoose.model('Employee');
            const hasEmployees = await Employee.exists({
                subdepartmentRef: this._id,
                isActive: true
            });
            return !hasEmployees;
        }
        return true; // If Employee model doesn't exist yet, allow deletion
    } catch (error) {
        console.error('Error checking if subdepartment can be deleted:', error);
        return false;
    }
};

subdepartmentSchema.methods.validateCapacityLimits = function () {
    const { current, maximum } = this.employeeCapacity;

    if (maximum && current > maximum) {
        throw new Error('Current employee count exceeds maximum capacity');
    }

    return true;
}

// Static Methods
subdepartmentSchema.statics.findByDepartment = function (departmentRef) {
    const query = { departmentRef };
    return this.find(query).sort({ subdepartmentName: 1 });
};

subdepartmentSchema.statics.findByCompany = function (companyRef) {
    const query = { companyRef };
    return this.find(query)
        .populate('departmentRef', 'departmentName')
        .sort({ 'departmentRef.departmentName': 1, subdepartmentName: 1 });
};

subdepartmentSchema.statics.findByFunctionType = function (companyRef, functionType) {
    return this.find({
        companyRef,
        functionType
    }).sort({ subdepartmentName: 1 });
};

subdepartmentSchema.statics.getCapacityReport = function (companyRef) {
    return this.aggregate([
        { $match: { companyRef: new mongoose.Types.ObjectId(companyRef), isActive: true } },
        {
            $group: {
                _id: '$departmentRef',
                totalCurrent: { $sum: '$employeeCapacity.current' },
                totalMaximum: { $sum: '$employeeCapacity.maximum' },
                subdepartmentCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'departments',
                localField: '_id',
                foreignField: '_id',
                as: 'department'
            }
        }
    ]);
};

// Pre-save middleware
subdepartmentSchema.pre('save', async function (next) {
    try {
        // Validate department belongs to same company
        if (this.isModified('departmentRef') || this.isModified('companyRef')) {
            const Department = mongoose.model('Department');
            const department = await Department.findById(this.departmentRef);

            if (!department) {
                return next(new Error('Invalid department reference'));
            }

            if (!department.companyRef.equals(this.companyRef)) {
                return next(new Error('Department must belong to the same company'));
            }

            if (!department.allowSubdepartments) {
                return next(new Error('This department does not allow subdepartments'));
            }
        }

        // Validate capacity limits
        this.validateCapacityLimits();

        // Validate operational hours
        if (this.operationalHours.startTime >= this.operationalHours.endTime) {
            return next(new Error('End time must be after start time'));
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-remove middleware
subdepartmentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const canDelete = await this.canBeDeleted();
        if (!canDelete) {
            return next(new Error('Cannot delete subdepartment with active employees'));
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Error handling for duplicates
subdepartmentSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if (error.keyPattern && error.keyPattern.subdepartmentCode) {
            next(new Error('Subdepartment code already exists in this department'));
        } else {
            next(new Error('Duplicate subdepartment entry found'));
        }
    } else {
        next(error);
    }
});

export const SubDepartment = mongoose.model("SubDepartment", subdepartmentSchema, "subdepartments");