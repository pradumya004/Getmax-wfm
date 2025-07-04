// frontend/src/components/company/EmployeeActions.jsx

import React, { useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  Key,
  UserX,
  UserCheck,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { ConfirmDialog } from "../common/ConfirmDialog.jsx";
import { employeeAPI } from "../../api/employee.api.js";
import { toast } from "react-hot-toast";

export const EmployeeActions = ({
  employee,
  onUpdate,
  onEdit,
  className = "",
}) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await employeeAPI.resetEmployeePassword(employee.employeeId);
      toast.success("Password reset email sent to employee");
      setShowResetPassword(false);
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      if (employee.systemInfo?.isActive) {
        await employeeAPI.deactivateEmployee(employee.employeeId);
        toast.success("Employee deactivated successfully");
      } else {
        await employeeAPI.reactivateEmployee(employee.employeeId);
        toast.success("Employee reactivated successfully");
      }
      onUpdate?.();
      setShowDeactivate(false);
    } catch (error) {
      toast.error("Failed to update employee status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await employeeAPI.deleteEmployee(employee.employeeId);
      toast.success("Employee deleted successfully");
      onUpdate?.();
      setShowDelete(false);
    } catch (error) {
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = () => {
    const subject = `Message from ${
      employee.companyRef?.companyName || "Company"
    }`;
    const mailtoLink = `mailto:${
      employee.contactInfo?.primaryEmail
    }?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink, "_blank");
  };

  const handleCall = () => {
    if (employee.contactInfo?.primaryPhone) {
      window.open(`tel:${employee.contactInfo.primaryPhone}`, "_blank");
    } else {
      toast.error("No phone number available");
    }
  };

  const isActive = employee.systemInfo?.isActive;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit?.(employee)}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>

        <Button
          variant="outline"
          theme="company"
          onClick={handleSendEmail}
          className="flex items-center space-x-2"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </Button>

        {employee.contactInfo?.primaryPhone && (
          <Button
            variant="outline"
            theme="company"
            onClick={handleCall}
            className="flex items-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </Button>
        )}
      </div>

      {/* Management Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          theme="company"
          onClick={() => setShowResetPassword(true)}
          className="flex items-center space-x-2"
        >
          <Key className="w-4 h-4" />
          <span>Reset Password</span>
        </Button>

        <Button
          variant="outline"
          theme="company"
          onClick={() => setShowDeactivate(true)}
          className={`flex items-center space-x-2 ${
            isActive
              ? "text-yellow-400 border-yellow-400"
              : "text-green-400 border-green-400"
          }`}
        >
          {isActive ? (
            <>
              <UserX className="w-4 h-4" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Activate</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowDelete(true)}
          className="flex items-center space-x-2 text-red-400 border-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </div>

      {/* Reset Password Confirmation */}
      <ConfirmDialog
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onConfirm={handleResetPassword}
        title="Reset Password"
        message={`Send password reset email to ${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}?`}
        confirmText="Send Email"
        type="info"
        loading={loading}
      />

      {/* Deactivate/Activate Confirmation */}
      <ConfirmDialog
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        onConfirm={handleToggleStatus}
        title={isActive ? "Deactivate Employee" : "Activate Employee"}
        message={`Are you sure you want to ${
          isActive ? "deactivate" : "activate"
        } ${employee.personalInfo?.firstName} ${
          employee.personalInfo?.lastName
        }?`}
        confirmText={isActive ? "Deactivate" : "Activate"}
        type={isActive ? "warning" : "info"}
        loading={loading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={loading}
      />
    </div>
  );
};