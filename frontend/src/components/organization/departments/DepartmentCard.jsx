// frontend/src/components/organization/departments/DepartmentCard.jsx

import React from "react";
import { Building, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
  employeeCount = 0,
  subdepartmentCount = 0,
}) => {
  return (
    <Card
      theme="company"
      className="p-6 group hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {department.departmentName}
            </h3>
            <p className="text-gray-400 text-sm">{department.departmentCode}</p>
          </div>
        </div>

        {department.departmentLevel && (
          <Badge variant="default">Level {department.departmentLevel}</Badge>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">Employees</p>
              <p className="text-white font-medium">{employeeCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-gray-400 text-xs">Sub-Depts</p>
              <p className="text-white font-medium">{subdepartmentCount}</p>
            </div>
          </div>
        </div>

        {department.costCenter && (
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Cost Center</span>
            <span className="text-white font-medium">
              {department.costCenter}
            </span>
          </div>
        )}

        {department.description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {department.description}
          </p>
        )}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit(department)}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(department)}
          className="p-2 text-red-400 border-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};