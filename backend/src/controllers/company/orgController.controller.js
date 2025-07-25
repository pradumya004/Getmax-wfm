// backend/src/controllers/company/orgController.controller.js

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Department } from "../../models/organization/department.model.js";
import { Role } from "../../models/organization/role.model.js";
import { Designation } from "../../models/organization/designation.model.js";
import { SubDepartment } from "../../models/organization/subdepartment.model.js";
import xlsx from 'xlsx';

const getOrganizationalData = asyncHandler(async (req, res) => {
    const companyId = req.company?.id || req.employee?.companyId;
    if (!companyId) {
        throw new ApiError(401, "Company authentication required");
    }

    try {
        const [departments, roles, designations, subdepartments] = await Promise.all([
            Department.find({ companyRef: companyId }).sort({ departmentName: 1 }),
            Role.find({ companyRef: companyId, isActive: true }).sort({ roleLevel: -1 }),
            Designation.find({ companyRef: companyId }).sort({ level: 1 }),
            SubDepartment.find({ companyRef: companyId }).sort({ subdepartmentName: 1 })
        ]);

        return res.status(200).json(
            new ApiResponse(200, {
                departments, roles, designations, subdepartments
            }, "Organizational data retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Error fetching organizational data: ${error.message}`);
    }
});

const downloadEmployeeTemplate = asyncHandler(async (req, res) => {
    const templateData = [
        {
            firstName: "John",
            middleName: "M",
            lastName: "Doe",
            email: "john.doe@company.com",
            phone: "+91-9876543210",
            dateOfJoining: "2024-01-15",
            workLocation: "Office",
            department: "IT",
            designation: "Software Engineer",
            role: "Employee"
        },
        {
            firstName: "Jane",
            middleName: "",
            lastName: "Smith",
            email: "jane.smith@company.com",
            phone: "+91-9876543211",
            dateOfJoining: "2024-02-01",
            workLocation: "Remote",
            department: "HR",
            designation: "HR Executive",
            role: "HR Staff"
        }
    ];

    const ws = xlsx.utils.json_to_sheet(templateData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Employee Template");

    res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="employee_upload_template.xlsx"'
    });

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);
});

export {
    getOrganizationalData,
    downloadEmployeeTemplate
};
