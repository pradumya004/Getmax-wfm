// frontend/src/components/organization/common/OrgHierarchy.jsx

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Building,
  Users,
  Briefcase,
} from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const OrgHierarchy = ({ orgData, employees = [] }) => {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());

  const toggleDepartment = (departmentId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getEmployeeCount = (departmentId, subdepartmentId = null) => {
    return employees.filter((emp) => {
      if (subdepartmentId) {
        return emp.subdepartmentRef?._id === subdepartmentId;
      }
      return emp.departmentRef?._id === departmentId;
    }).length;
  };

  const getSubdepartments = (departmentId) => {
    return orgData.subdepartments.filter(
      (sub) => sub.departmentRef === departmentId
    );
  };

  return (
    <Card theme="company" className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Organization Hierarchy
      </h3>

      <div className="space-y-4">
        {orgData.departments.map((department) => {
          const isExpanded = expandedDepartments.has(department._id);
          const subdepartments = getSubdepartments(department._id);
          const employeeCount = getEmployeeCount(department._id);

          return (
            <div key={department._id} className="space-y-2">
              {/* Department */}
              <div
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => toggleDepartment(department._id)}
              >
                <div className="flex items-center space-x-3">
                  {subdepartments.length > 0 && (
                    <button className="p-1">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}

                  <Building className="w-5 h-5 text-green-400" />

                  <div>
                    <h4 className="text-white font-medium">
                      {department.departmentName}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {department.departmentCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="default">{employeeCount} employees</Badge>
                  {subdepartments.length > 0 && (
                    <Badge variant="default">
                      {subdepartments.length} sub-depts
                    </Badge>
                  )}
                </div>
              </div>

              {/* Subdepartments */}
              {isExpanded && subdepartments.length > 0 && (
                <div className="ml-8 space-y-2">
                  {subdepartments.map((subdepartment) => {
                    const subEmployeeCount = getEmployeeCount(
                      department._id,
                      subdepartment._id
                    );

                    return (
                      <div
                        key={subdepartment._id}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-blue-400" />
                          <div>
                            <h5 className="text-white">
                              {subdepartment.subdepartmentName}
                            </h5>
                            <p className="text-gray-400 text-sm">
                              {subdepartment.subdepartmentCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="text-xs">
                            {subEmployeeCount} employees
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            {subdepartment.functionType}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {orgData.departments.length === 0 && (
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No departments created yet</p>
          <p className="text-gray-500 text-sm">
            Start by creating your first department
          </p>
        </div>
      )}
    </Card>
  );
};