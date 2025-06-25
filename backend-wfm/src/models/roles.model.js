import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const roleSchema = new mongoose.Schema({
    roleId: {
        type: String,
        default: () => `ROLE-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    companyId: {
        type: String,
        ref: 'companies',
        required: true
    },

    // Role Info
    roleName: {
        type: String,
        required: true,
        trim: true
    },
    roleDescription: {
        type: String,
        trim: true
    },
    roleLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 1,
        required: true
    },

    // Access Permissions
    permissionOverrides: {
        employeePermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            default: "None"
        },
        clientPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            default: "None"
        },
        sowPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Manage", "Full"],
            default: "None"
        },
        claimPermissions: {
            type: String,
            enum: ["None", "ViewOwn", "ViewTeam", "ViewAll", "Assign", "Manage", "Full"],
            default: "ViewOwn"
        },
        reportPermissions: {
            type: String,
            enum: ["None", "View", "Create", "Export", "Full"],
            default: "None"
        },
        
    },

    // Data Access Restrictions
    dataAccessOverrides: {
        clientRestriction: {
            type: String,
            enum: ["All", "Assigned", "None"]
        },
        claimRestriction: {
            type: String,
            enum: ["All", "Assigned", "Team", "None"]
        },
        sowRestriction: {
            type: String,
            enum: ["All", "Assigned", "None"]
        },
        reportScope: {
            type: String,
            enum: ["Company", "Team", "Self"]
        },
        financialDataAccess: {
            type: Boolean
        }
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees"
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees"
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
companySchema.index({ companyId: 1, roleName: 1 }, { unique: true });
roleSchema.index({ companyId: 1, roleLevel: 1 });

roleSchema.virtual('permissions').get(function () {
    const level = this.roleLevel;
    const overrides = this.permissionOverrides || {};

    // Default Permissions Based On Role Level
    const defaultPermissions = {
        // Intern / Basic Employee
        1: {
            employeePermissions: "None",
            clientPermissions: "View",
            sowPermissions: "View",
            claimPermissions: "ViewOwn",
            reportPermissions: "None"
        },
        // Senior Employee
        3: {
            employeePermissions: "View",
            clientPermissions: "View",
            sowPermissions: "Create",
            claimPermissions: "ViewOwn",
            reportPermissions: "View"
        },
        // Team Lead / Supervisor
        5: {
            employeePermissions: "View",
            clientPermissions: "Create",
            sowPermissions: "Manage",
            claimPermissions: "ViewTeam",
            reportPermissions: "Create"
        },
        // Manager
        7: {
            employeePermissions: "Manage",
            clientPermissions: "Manage",
            sowPermissions: "Full",
            claimPermissions: "Assign",
            reportPermissions: "Export"
        },
        // Owner / Admin
        9: {
            employeePermissions: "Full",
            clientPermissions: "Full",
            sowPermissions: "Full",
            claimPermissions: "Full",
            reportPermissions: "Full"
        },
    }

    let basePermissions = defaultPermissions[1];
    for (let i = level; i >= 1; i--) {
        if (defaultPermissions[i]) {
            basePermissions = defaultPermissions[i];
            break;
        }
    }

    return {
        employeePermissions: overrides.employeePermissions || basePermissions.employeePermissions,
        
    }
})

// Instance Methods
roleSchema.methods.hasPermission = function (permission) {
    return this.permissions[permission] || false;
}

roleSchema.methods.canAccess = function (resource, action) {
    return this.permissions[`can${action}${resource}`] || false;
};

const Role = mongoose.model("roles", roleSchema);

export default Role;