// frontend/src/pages/employee/EditProfile.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { employeeAPI } from "../../api/employee.api.js";
import { useApi } from "../../hooks/useApi.jsx";
import { validateForm } from "../../lib/validation.js";
import { toast } from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    primaryPhone: "",
    secondaryEmail: "",
    personalAddress: "",
  });
  const [errors, setErrors] = useState({});

  const { loading, execute: fetchProfile } = useApi(employeeAPI.getMyProfile);
  const { loading: updateLoading, execute: updateProfile } = useApi(
    employeeAPI.updateMyProfile
  );

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await fetchProfile();
    if (data) {
      setProfile(data);
      setFormData({
        firstName: data.personalInfo?.firstName || "",
        lastName: data.personalInfo?.lastName || "",
        middleName: data.personalInfo?.middleName || "",
        primaryPhone: data.contactInfo?.primaryPhone || "",
        secondaryEmail: data.contactInfo?.secondaryEmail || "",
        personalAddress: data.personalInfo?.personalAddress || "",
      });
    }
  };

  const rules = {
    firstName: { required: true, label: "First Name" },
    lastName: { required: true, label: "Last Name" },
    primaryPhone: { type: "phone", label: "Phone Number" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await updateProfile({
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
      navigate("/employee/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-6">
      <Helmet>
        <title>Edit Profile - GetMax</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/profile")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-emerald-200">
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card theme="employee" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Personal Information
              </h3>
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
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={formData.primaryPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryPhone: e.target.value })
                  }
                  error={errors.primaryPhone}
                  theme="employee"
                />

                <Input
                  label="Personal Email"
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryEmail: e.target.value })
                  }
                  theme="employee"
                  placeholder="personal@example.com"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Address</h3>
              <Input
                label="Personal Address"
                value={formData.personalAddress}
                onChange={(e) =>
                  setFormData({ ...formData, personalAddress: e.target.value })
                }
                theme="employee"
                placeholder="Your home address"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t border-slate-700">
              <Button
                type="submit"
                theme="employee"
                loading={updateLoading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/employee/profile")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
