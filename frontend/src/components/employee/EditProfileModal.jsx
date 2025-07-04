// frontend/src/components/employee/EditProfileModal.jsx

import React, { useState } from "react";
import { Save, User } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { validateForm } from "../../lib/validation.js";
import { employeeAPI } from "../../api/employee.api.js";
import { toast } from "react-hot-toast";

export const EditProfileModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: employee?.personalInfo?.firstName || "",
    lastName: employee?.personalInfo?.lastName || "",
    middleName: employee?.personalInfo?.middleName || "",
    primaryPhone: employee?.contactInfo?.primaryPhone || "",
    secondaryEmail: employee?.contactInfo?.secondaryEmail || "",
    personalAddress: employee?.personalInfo?.personalAddress || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const rules = {
    firstName: { required: true, label: "First Name" },
    lastName: { required: true, label: "Last Name" },
    primaryPhone: { type: "phone", label: "Phone Number" },
    secondaryEmail: { type: "email", label: "Personal Email" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await employeeAPI.updateMyProfile({
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          personalAddress: formData.personalAddress,
        },
        contactInfo: {
          primaryPhone: formData.primaryPhone,
          secondaryEmail: formData.secondaryEmail,
        },
      });

      toast.success("Profile updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-white font-medium">Personal Information</h3>
            <p className="text-emerald-400 text-sm">
              Update your profile details
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            error={errors.firstName}
            theme="employee"
          />

          <Input
            label="Middle Name"
            value={formData.middleName}
            onChange={(e) =>
              setFormData({ ...formData, middleName: e.target.value })
            }
            theme="employee"
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            error={errors.lastName}
            theme="employee"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={formData.primaryPhone}
            onChange={(e) =>
              setFormData({ ...formData, primaryPhone: e.target.value })
            }
            error={errors.primaryPhone}
            theme="employee"
            placeholder="+1 (555) 123-4567"
          />

          <Input
            label="Personal Email"
            type="email"
            value={formData.secondaryEmail}
            onChange={(e) =>
              setFormData({ ...formData, secondaryEmail: e.target.value })
            }
            error={errors.secondaryEmail}
            theme="employee"
            placeholder="personal@example.com"
          />
        </div>

        {/* Address */}
        <Input
          label="Personal Address"
          value={formData.personalAddress}
          onChange={(e) =>
            setFormData({ ...formData, personalAddress: e.target.value })
          }
          theme="employee"
          placeholder="Your home address"
        />

        {/* Actions */}
        <div className="flex space-x-3 pt-6">
          <Button
            type="submit"
            theme="employee"
            loading={loading}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
