// frontend/src/components/organization/subdepartments/SubDepartmentCard.jsx

import React from "react";
import { Users, Layers, Settings, Edit, Trash2 } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const SubDepartmentCard = ({
  subdepartment,
  onEdit,
  onDelete,
  employeeCount = 0,
}) => {
  const getFunctionIcon = (functionType) => {
    switch (functionType) {
      case "Technical":
        return Settings;
      case "Operational":
        return Layers;
      default:
        return Users;
    }
  };

  const getFunctionColor = (functionType) => {
    const colors = {
      Operational: "from-blue-500 to-indigo-500",
      Support: "from-green-500 to-emerald-500",
      Administrative: "from-purple-500 to-pink-500",
      Technical: "from-orange-500 to-red-500",
      Quality: "from-yellow-500 to-orange-500",
      Training: "from-cyan-500 to-blue-500",
    };
    return colors[functionType] || "from-gray-500 to-slate-500";
  };

  const IconComponent = getFunctionIcon(subdepartment.functionType);
  const functionGradient = getFunctionColor(subdepartment.functionType);

  return (
    <Card
      theme="company"
      className="p-6 group hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-r ${functionGradient} rounded-xl flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {subdepartment.subdepartmentName}
            </h3>
            <p className="text-gray-400 text-sm">
              {subdepartment.subdepartmentCode}
            </p>
          </div>
        </div>

        <Badge variant="default">{subdepartment.functionType}</Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Parent Department</span>
          <span className="text-blue-400 text-sm">
            {subdepartment.departmentRef?.departmentName}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Employees</span>
          <span className="text-white font-medium">{employeeCount}</span>
        </div>

        {subdepartment.description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {subdepartment.description}
          </p>
        )}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit(subdepartment)}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(subdepartment)}
          className="p-2 text-red-400 border-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};