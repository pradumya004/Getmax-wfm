// frontend/src/pages/company/organization/OrgHierarchyView.jsx

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Building, Users, Layers, Grid, List, Search } from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { SearchBar } from "../../../components/common/SearchBar.jsx";
import { OrgHierarchy } from "../../../components/organization/common/OrgHierarchy.jsx";
import { useOrganization } from "../../../hooks/useOrganization.jsx";
import { useEmployees } from "../../../hooks/useEmployee.jsx";

const OrgHierarchyView = () => {
  const [viewMode, setViewMode] = useState("hierarchy"); // 'hierarchy' or 'grid'
  const [searchTerm, setSearchTerm] = useState("");
  const { orgData } = useOrganization();
  const { employees } = useEmployees();

  const filteredOrgData = {
    departments: orgData.departments.filter((dept) =>
      dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    roles: orgData.roles,
    designations: orgData.designations,
    subdepartments: orgData.subdepartments,
  };

  const getEmployeeCount = (departmentId, subdepartmentId = null) => {
    return employees.filter((emp) => {
      if (subdepartmentId) {
        return emp.subdepartmentRef?._id === subdepartmentId;
      }
      return emp.departmentRef?._id === departmentId;
    }).length;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredOrgData.departments.map((department) => {
        const subdepartments = orgData.subdepartments.filter(
          (sub) => sub.departmentRef === department._id
        );
        const employeeCount = getEmployeeCount(department._id);

        return (
          <Card key={department._id} theme="company" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Building className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {department.departmentName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {department.departmentCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold">{employeeCount}</div>
                <div className="text-gray-400 text-xs">Employees</div>
              </div>
            </div>

            {department.description && (
              <p className="text-gray-300 text-sm mb-4">
                {department.description}
              </p>
            )}

            {subdepartments.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3">
                  Sub-Departments ({subdepartments.length})
                </h4>
                <div className="space-y-2">
                  {subdepartments.slice(0, 3).map((subdept) => (
                    <div
                      key={subdept._id}
                      className="flex items-center justify-between p-2 bg-slate-800/50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">
                          {subdept.subdepartmentName}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {getEmployeeCount(department._id, subdept._id)} emp
                      </span>
                    </div>
                  ))}
                  {subdepartments.length > 3 && (
                    <div className="text-center">
                      <span className="text-blue-400 text-sm">
                        +{subdepartments.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Organization Hierarchy - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Organization Hierarchy
            </h1>
            <p className="text-blue-200">
              Visualize your company's organizational structure
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search departments..."
              onClear={() => setSearchTerm("")}
              className="w-64"
            />

            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
              <Button
                variant={viewMode === "hierarchy" ? "primary" : "ghost"}
                theme="company"
                onClick={() => setViewMode("hierarchy")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                theme="company"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card theme="company" className="p-6 text-center">
            <Building className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {orgData.departments.length}
            </div>
            <div className="text-gray-400 text-sm">Departments</div>
          </Card>

          <Card theme="company" className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {orgData.subdepartments.length}
            </div>
            <div className="text-gray-400 text-sm">Sub-Departments</div>
          </Card>

          <Card theme="company" className="p-6 text-center">
            <Layers className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {orgData.roles.length}
            </div>
            <div className="text-gray-400 text-sm">Roles</div>
          </Card>

          <Card theme="company" className="p-6 text-center">
            <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {employees.length}
            </div>
            <div className="text-gray-400 text-sm">Total Employees</div>
          </Card>
        </div>

        {/* Organization View */}
        {viewMode === "hierarchy" ? (
          <OrgHierarchy orgData={filteredOrgData} employees={employees} />
        ) : (
          renderGridView()
        )}

        {filteredOrgData.departments.length === 0 && searchTerm && (
          <Card theme="company" className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">
              No departments found
            </h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrgHierarchyView;