// frontend/src/components/organization/departments/DepartmentHierarchy.jsx

import React, { useState } from "react";
import { Building, ChevronRight, ChevronDown, Users } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const DepartmentHierarchy = ({
  departments,
  subdepartments,
  employees = [],
}) => {
  const [expandedDepts, setExpandedDepts] = useState(new Set());

  const toggleDepartment = (deptId) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const getSubdepartments = (deptId) => {
    return subdepartments.filter((sub) => sub.departmentRef === deptId);
  };

  const getEmployeeCount = (deptId, subDeptId = null) => {
    return employees.filter((emp) => {
      if (subDeptId) {
        return emp.subdepartmentRef?._id === subDeptId;
      }
      return emp.departmentRef?._id === deptId;
    }).length;
  };

  const buildHierarchy = () => {
    const rootDepartments = departments.filter(
      (dept) => !dept.parentDepartment
    );

    const renderDepartment = (department, level = 0) => {
      const subdepts = getSubdepartments(department._id);
      const childDepartments = departments.filter(
        (dept) => dept.parentDepartment === department._id
      );
      const isExpanded = expandedDepts.has(department._id);
      const hasChildren = subdepts.length > 0 || childDepartments.length > 0;
      const employeeCount = getEmployeeCount(department._id);

      return (
        <div key={department._id} className={`${level > 0 ? "ml-6" : ""}`}>
          <div
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors mb-2"
            onClick={() => hasChildren && toggleDepartment(department._id)}
          >
            <div className="flex items-center space-x-3">
              {hasChildren && (
                <button className="p-1">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}

              <Building
                className={`w-5 h-5 ${
                  level === 0 ? "text-green-400" : "text-blue-400"
                }`}
              />

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
              {subdepts.length > 0 && (
                <Badge variant="default">{subdepts.length} sub-depts</Badge>
              )}
              <Badge variant="default">
                Level {department.departmentLevel || 1}
              </Badge>
            </div>
          </div>

          {/* Subdepartments */}
          {isExpanded && subdepts.length > 0 && (
            <div className="ml-8 mb-4">
              {subdepts.map((subdept) => (
                <div
                  key={subdept._id}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg mb-2"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-purple-400" />
                    <div>
                      <h5 className="text-white">
                        {subdept.subdepartmentName}
                      </h5>
                      <p className="text-gray-400 text-sm">
                        {subdept.subdepartmentCode} • {subdept.functionType}
                      </p>
                    </div>
                  </div>

                  <Badge variant="default">
                    {getEmployeeCount(department._id, subdept._id)} employees
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Child Departments */}
          {isExpanded &&
            childDepartments.map((childDept) =>
              renderDepartment(childDept, level + 1)
            )}
        </div>
      );
    };

    return rootDepartments.map((dept) => renderDepartment(dept));
  };

  return (
    <Card theme="company" className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Department Hierarchy
      </h3>

      <div className="space-y-2">{buildHierarchy()}</div>

      {departments.length === 0 && (
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No departments found</p>
        </div>
      )}
    </Card>
  );
};