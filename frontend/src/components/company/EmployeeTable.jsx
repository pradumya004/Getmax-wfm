// frontend/src/components/company/EmployeeTable.jsx

import React, { useState } from "react";
import { Edit, Trash2, Eye, Mail, Phone, MoreVertical } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/Table.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Dropdown, DropdownItem, DropdownSeparator } from "../ui/Dropdown.jsx";
import { getInitials, formatDate } from "../../lib/utils.js";

export const EmployeeTable = ({
  employees = [],
  onView,
  onEdit,
  onDeactivate,
  onDelete,
  onSendEmail,
  loading = false,
}) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortField) return 0;

    let aVal = a;
    let bVal = b;

    // Handle nested properties
    if (sortField.includes(".")) {
      const fields = sortField.split(".");
      aVal = fields.reduce((obj, field) => obj?.[field], a);
      bVal = fields.reduce((obj, field) => obj?.[field], b);
    } else {
      aVal = a[sortField];
      bVal = b[sortField];
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableHead
          sortable
          onSort={() => handleSort("personalInfo.firstName")}
          sortDirection={
            sortField === "personalInfo.firstName" ? sortDirection : null
          }
        >
          Employee
        </TableHead>
        <TableHead
          sortable
          onSort={() => handleSort("contactInfo.primaryEmail")}
          sortDirection={
            sortField === "contactInfo.primaryEmail" ? sortDirection : null
          }
        >
          Email
        </TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Department</TableHead>
        <TableHead
          sortable
          onSort={() => handleSort("employmentInfo.dateOfJoining")}
          sortDirection={
            sortField === "employmentInfo.dateOfJoining" ? sortDirection : null
          }
        >
          Join Date
        </TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableHeader>
      <TableBody>
        {sortedEmployees.map((employee) => (
          <TableRow key={employee.employeeId}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs">
                    {getInitials(
                      `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`
                    )}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {employee.personalInfo?.firstName}{" "}
                    {employee.personalInfo?.lastName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {employee.employeeId}
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {employee.contactInfo?.primaryEmail}
                </span>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-blue-400">
                {employee.roleRef?.roleName || "N/A"}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-purple-400">
                {employee.departmentRef?.departmentName || "N/A"}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-gray-300">
                {formatDate(employee.employmentInfo?.dateOfJoining, "short")}
              </span>
            </TableCell>

            <TableCell>
              <Badge
                status={employee.systemInfo?.isActive ? "active" : "inactive"}
              >
                {employee.systemInfo?.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>

            <TableCell>
              <Dropdown
                trigger={
                  <Button variant="ghost" className="p-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                }
                align="right"
              >
                <DropdownItem onClick={() => onView?.(employee)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownItem>
                <DropdownItem onClick={() => onEdit?.(employee)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownItem>
                <DropdownItem onClick={() => onSendEmail?.(employee)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  onClick={() => onDeactivate?.(employee)}
                  className="text-yellow-400"
                >
                  {employee.systemInfo?.isActive ? "Deactivate" : "Activate"}
                </DropdownItem>
                <DropdownItem
                  onClick={() => onDelete?.(employee)}
                  className="text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};