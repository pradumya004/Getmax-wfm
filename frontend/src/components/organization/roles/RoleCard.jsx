// frontend/src/components/organization/roles/RoleCard.jsx

import React from "react";
import { Shield, Users, Edit, Trash2, Crown } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const RoleCard = ({ role, onEdit, onDelete, employeeCount = 0 }) => {
  const getRoleIcon = (roleLevel) => {
    if (roleLevel >= 7) return Crown;
    if (roleLevel >= 5) return Shield;
    return Users;
  };

  const getRoleLevelColor = (roleLevel) => {
    if (roleLevel >= 7) return "text-yellow-400";
    if (roleLevel >= 5) return "text-purple-400";
    if (roleLevel >= 3) return "text-blue-400";
    return "text-green-400";
  };

  const IconComponent = getRoleIcon(role.roleLevel);
  const levelColor = getRoleLevelColor(role.roleLevel);

  return (
    <Card
      theme="company"
      className="p-6 group hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {role.roleName}
            </h3>
            <p className="text-gray-400 text-sm">{role.roleCode}</p>
          </div>
        </div>

        <Badge variant="default" className={levelColor}>
          Level {role.roleLevel}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Employees</span>
          <span className="text-white font-medium">{employeeCount}</span>
        </div>

        {role.description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {role.description}
          </p>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Created</span>
          <span className="text-gray-300 text-sm">
            {new Date(role.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit(role)}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(role)}
          className="p-2 text-red-400 border-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};