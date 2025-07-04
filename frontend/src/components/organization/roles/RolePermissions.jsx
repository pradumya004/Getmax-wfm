// frontend/src/components/organization/roles/RolePermissions.jsx

import React, { useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { PERMISSIONS } from "../../../lib/permissions.js";

export const RolePermissions = ({ role, onSave, onCancel }) => {
  const [permissions, setPermissions] = useState(role?.permissions || []);

  const permissionGroups = {
    "Employee Management": [
      PERMISSIONS.VIEW_ALL_EMPLOYEES,
      PERMISSIONS.CREATE_EMPLOYEE,
      PERMISSIONS.EDIT_EMPLOYEE,
      PERMISSIONS.DELETE_EMPLOYEE,
    ],
    Organization: [
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.MANAGE_DEPARTMENTS,
      PERMISSIONS.MANAGE_DESIGNATIONS,
    ],
    Profile: [
      PERMISSIONS.VIEW_OWN_PROFILE,
      PERMISSIONS.EDIT_OWN_PROFILE,
      PERMISSIONS.VIEW_OWN_PERFORMANCE,
    ],
    Administration: [
      PERMISSIONS.MANAGE_COMPANIES,
      PERMISSIONS.VIEW_PLATFORM_STATS,
      PERMISSIONS.SUSPEND_COMPANY,
    ],
  };

  const togglePermission = (permission) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    onSave({ ...role, permissions });
  };

  return (
    <Card theme="company" className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Role Permissions</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(permissionGroups).map(
          ([groupName, groupPermissions]) => (
            <div key={groupName}>
              <h4 className="text-white font-medium mb-3">{groupName}</h4>
              <div className="space-y-2">
                {groupPermissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <span className="text-gray-300">
                      {permission
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <button
                      onClick={() => togglePermission(permission)}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        permissions.includes(permission)
                          ? "bg-green-500 text-white"
                          : "bg-slate-700 text-gray-400"
                      }`}
                    >
                      {permissions.includes(permission) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex space-x-3 mt-6 pt-6 border-t border-slate-700">
        <Button theme="company" onClick={handleSave} className="flex-1">
          Save Permissions
        </Button>
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </Card>
  );
};