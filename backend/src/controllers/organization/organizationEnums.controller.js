// backend/src/controllers/organization/organizationEnums.controller.js

import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getOrganizationEnums = asyncHandler(async (req, res) => {
    // Extract all enums from your models
    const organizationEnums = {
        role: {
            permissions: {
                employeePermissions: ["None", "View", "Create", "Manage", "Full"],
                clientPermissions: ["None", "View", "Create", "Manage", "Full"],
                sowPermissions: ["None", "View", "Create", "Manage", "Full"],
                claimPermissions: ["None", "ViewOwn", "ViewTeam", "ViewAll", "Assign", "Manage", "Full"],
                reportPermissions: ["None", "View", "Create", "Export", "Full"]
            },
            dataAccess: {
                clientRestriction: ["All", "Assigned", "None"],
                claimRestriction: ["All", "Assigned", "Team", "None"],
                sowRestriction: ["All", "Assigned", "None"],
                reportScope: ["Company", "Team", "Self"],
                financialDataAccess: [true, false]
            },
            roleLevel: {
                min: 1,
                max: 10
            }
        },

        department: {
            departmentLevel: {
                min: 1,
                max: 10
            }
        },

        designation: {
            category: ["C-Level", "VP", "Director", "Manager", "Team Lead", "Senior", "Mid Level", "Junior", "Entry Level", "Intern", "Contractor", "Consultant"],
            requiredEducation: ["None", "High School", "Associates", "Bachelors", "Masters", "PhD", "Professional Certification"],
            level: {
                min: 1,
                max: 15
            }
        },

        subdepartment: {
            // functionType: ["Operational", "Support", "Administrative", "Technical", "Quality", "Training", "Research", "Development"],
            // workType: ["Production", "Support", "Quality Control", "Training", "Administrative", "Research"],
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },

        // Common enums used across multiple entities
        common: {
            currency: ["USD", "INR", "EUR", "GBP", "CAD"],
            timeZone: ["EST", "CST", "MST", "PST", "GMT", "IST"]
        }
    };
    return res.status(200).json(
        new ApiResponse(200, organizationEnums, "Organization enums retrieved successfully")
    );
});