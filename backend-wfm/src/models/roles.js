import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const roleSchema = new mongoose.Schema({
    roleId: {
        type: String,
        default: () => `ROLE-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    roleName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    roleDescription: {
        type: String,
        trim: true
    },
    roleLevel: {
        type: Number,
        required: true
    },
    permissions: {
        type: Object, // Use JSON-compatible structure
        default: {}
    },
    canViewAllCompanies: {
        type: Boolean,
        default: false
    },
    canManageAllEmployees: {
        type: Boolean,
        default: false
    },
    canConfigureSOWs: {
        type: Boolean,
        default: false
    },
    canViewFinancials: {
        type: Boolean,
        default: false
    },
    canExportData: {
        type: Boolean,
        default: false
    },
    canApproveWork: {
        type: Boolean,
        default: false
    },
    maxClaimsPerDay: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


const Role = mongoose.model("roles", roleSchema);

export default Role;