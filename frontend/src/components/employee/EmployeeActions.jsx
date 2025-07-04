// frontend/src/components/employee/EmployeeActions.jsx

import React, { useState } from "react";
import { Edit, Upload, Key, Settings, User } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { toast } from "react-hot-toast";
import { EditProfileModal } from "./EditProfileModal.jsx";
import { AvatarUpload } from "./AvatarUpload.jsx";

export const EmployeeActions = ({ employee, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const actions = [
    {
      icon: Edit,
      label: "Edit Profile",
      description: "Update your personal information",
      onClick: () => setShowEditModal(true),
      color: "text-blue-400",
    },
    {
      icon: Upload,
      label: "Change Avatar",
      description: "Upload a new profile picture",
      onClick: () => setShowAvatarUpload(true),
      color: "text-green-400",
    },
    {
      icon: Key,
      label: "Change Password",
      description: "Update your login password",
      onClick: () => {
        // This would typically open a change password modal
        toast.info("Password change feature coming soon");
      },
      color: "text-yellow-400",
    },
    {
      icon: Settings,
      label: "Preferences",
      description: "Manage your account settings",
      onClick: () => {
        toast.info("Preferences feature coming soon");
      },
      color: "text-purple-400",
    },
  ];

  return (
    <Card theme="employee" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;

          return (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center space-x-3 p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
            >
              <div
                className={`w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center ${action.color}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">{action.label}</h4>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={employee}
        onSuccess={() => {
          onUpdate?.();
          setShowEditModal(false);
        }}
      />

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-lg font-semibold mb-4">
              Change Avatar
            </h3>
            <AvatarUpload
              currentAvatar={employee?.avatar}
              onSuccess={() => {
                onUpdate?.();
                setShowAvatarUpload(false);
              }}
            />
            <Button
              variant="ghost"
              onClick={() => setShowAvatarUpload(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
