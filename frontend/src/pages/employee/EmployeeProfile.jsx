// frontend/src/pages/employee/EmployeeProfile.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  Briefcase,
  Building,
  Shield,
  Award,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Info,
  Lock,
  Globe,
  Clock,
  Target,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Label } from "../../components/ui/Label.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { useEmployee } from "../../hooks/useEmployee.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate } from "../../lib/utils.js";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const EmployeeProfile = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { employee, loading, error, updateEmployee, uploadAvatar } =
    useEmployee();

  console.log("Employee:", employee);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const fileInputRef = useRef(null);

  // Initialize edit data when employee loads
  useEffect(() => {
    if (employee) {
      setEditData({
        firstName: employee.data.personalInfo?.firstName || "",
        lastName: employee.data.personalInfo?.lastName || "",
        middleName: employee.data.personalInfo?.middleName || "",
        primaryPhone: employee.data.contactInfo?.primaryPhone || "",
        dateOfBirth: employee.data.personalInfo?.dateOfBirth?.split("T")[0] || "",
        gender: employee.data.personalInfo?.gender || "",
        bloodGroup: employee.data.personalInfo?.bloodGroup || "",
        nationality: employee.data.personalInfo?.nationality || "",
      });
    }
  }, [employee]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    try {
      setIsUpdating(true);
      await uploadAvatar(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const updateData = {
        personalInfo: {
          firstName: editData.firstName,
          lastName: editData.lastName,
          middleName: editData.middleName,
          dateOfBirth: editData.dateOfBirth,
          gender: editData.gender,
          bloodGroup: editData.bloodGroup,
          nationality: editData.nationality,
        },
        contactInfo: {
          primaryPhone: editData.primaryPhone,
        },
      };

      await updateEmployee(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const profileSections = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal Info", icon: Info },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Award },
    { id: "performance", label: "Performance", icon: Target },
  ];

  // Mock data for demonstration
  const mockData = {
    skills: [
      { name: "Medical Claims", level: "Expert", progress: 95 },
      { name: "Data Analysis", level: "Advanced", progress: 85 },
      { name: "Customer Service", level: "Expert", progress: 90 },
      { name: "Quality Assurance", level: "Intermediate", progress: 70 },
    ],
    certifications: [
      {
        name: "Healthcare Claims Processing",
        issuer: "AHIMA",
        date: "2023-06-15",
        valid: true,
      },
      {
        name: "Medical Coding",
        issuer: "AAPC",
        date: "2023-03-20",
        valid: true,
      },
      {
        name: "Quality Management",
        issuer: "ASQ",
        date: "2022-11-10",
        valid: true,
      },
    ],
    performance: {
      currentLevel: 5,
      totalXP: 12340,
      tasksCompleted: 1247,
      qualityScore: 94.2,
      averageTime: 2.3,
      achievements: 23,
    },
  };

  console.log("Set Data: ", editData);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" theme={userType} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card theme={userType} className="p-8 text-center">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} theme={userType}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${theme.text}`}>
            My Profile
          </h1>
          <p className={`text-${theme.textSecondary}`}>
            Manage your personal information and view your performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                theme={userType}
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              theme={userType}
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card theme={userType} className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            {/* <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
              <img
                src={
                  avatarPreview ||
                  employee?.data?.personalInfo?.profilePicture
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div> */}

            {employee?.data?.personalInfo?.profilePicture ? (
                  <img
                    src={employee?.data?.avatarUrl}
                    alt={employee?.data?.fullName}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                  />
                ) : (
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20`}
                  >
                    {employee?.data?.personalInfo?.firstName?.charAt(0)}
                    {employee?.data?.personalInfo?.lastName?.charAt(0)}
                  </div>
                )}

            {/* Level Badge */}
            <div
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-6 rounded-full bg-${theme.accent} flex items-center justify-center`}
            >
              <span className="text-white text-sm font-bold">
                L{mockData.performance.currentLevel}
              </span>
            </div>

            {isEditing && (
              <div className="absolute top-0 right-0">
                <Button
                  size="sm"
                  theme={userType}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            )}

            {avatarFile && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <Button
                  size="sm"
                  theme={userType}
                  onClick={handleAvatarUpload}
                  disabled={isUpdating}
                  className="text-xs"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3 mr-1" />
                  )}
                  Upload
                </Button>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <h2 className={`text-2xl font-bold text-${theme.text}`}>
                {employee?.data?.personalInfo?.firstName}{" "}
                {employee?.data?.personalInfo?.lastName}
              </h2>
              <p className={`text-${theme.textSecondary} mt-1`}>
                {employee?.data?.designationRef?.designationName} •{" "}
                {employee?.data?.departmentRef?.departmentName}
              </p>
              <p className={`text-sm text-${theme.textSecondary} mt-1`}>
                Employee ID: {employee?.data?.employeeId}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold text-${theme.text}`}>
                  {mockData.performance.tasksCompleted}
                </div>
                <div className={`text-sm text-${theme.textSecondary}`}>
                  Tasks Completed
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold text-${theme.text}`}>
                  {mockData.performance.qualityScore}%
                </div>
                <div className={`text-sm text-${theme.textSecondary}`}>
                  Quality Score
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold text-${theme.text}`}>
                  {mockData.performance.achievements}
                </div>
                <div className={`text-sm text-${theme.textSecondary}`}>
                  Achievements
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {profileSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeSection === section.id
                ? `${theme.button} text-white`
                : `text-${theme.textSecondary} hover:text-${theme.text}`
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeSection === "overview" && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Profile Overview
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 text-${theme.textSecondary}`} />
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Email:
                      </span>
                    </div>
                    <p className={`text-${theme.text} font-medium`}>
                      {employee?.data?.contactInfo?.primaryEmail}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Phone:
                      </span>
                    </div>
                    <p className={`text-${theme.text} font-medium`}>
                      {employee?.data?.contactInfo?.primaryPhone || "Not provided"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Joined:
                      </span>
                    </div>
                    <p className={`text-${theme.text} font-medium`}>
                      {formatDate(employee?.data?.employmentInfo?.dateOfJoining)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Location:
                      </span>
                    </div>
                    <p className={`text-${theme.text} font-medium`}>
                      {employee?.data?.employmentInfo?.workLocation || "Office"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className={`font-medium text-${theme.text} mb-3`}>
                    Organization
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building
                          className={`w-4 h-4 text-${theme.textSecondary}`}
                        />
                        <span className={`text-sm text-${theme.textSecondary}`}>
                          Department:
                        </span>
                      </div>
                      <p className={`text-${theme.text} font-medium`}>
                        {employee?.data?.departmentRef?.departmentName}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase
                          className={`w-4 h-4 text-${theme.textSecondary}`}
                        />
                        <span className={`text-sm text-${theme.textSecondary}`}>
                          Designation:
                        </span>
                      </div>
                      <p className={`text-${theme.text} font-medium`}>
                        {employee?.data?.designationRef?.designationName}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield
                          className={`w-4 h-4 text-${theme.textSecondary}`}
                        />
                        <span className={`text-sm text-${theme.textSecondary}`}>
                          Role:
                        </span>
                      </div>
                      <p className={`text-${theme.text} font-medium`}>
                        {employee?.data?.roleRef?.roleName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "personal" && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={editData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={editData.middleName || ""}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label htmlFor="primaryPhone">Phone Number</Label>
                  <Input
                    id="primaryPhone"
                    value={editData.primaryPhone || ""}
                    onChange={(e) =>
                      handleInputChange("primaryPhone", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={
                      isEditing
                        ? editData.dateOfBirth
                        : employee?.data?.personalInfo?.dateOfBirth?.split("T")[0] ||
                          ""
                    }
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    id="gender"
                    // value={editData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <select
                    id="bloodGroup"
                    value={
                      isEditing
                        ? editData.bloodGroup
                        : employee?.data?.personalInfo?.bloodGroup || ""
                    }
                    onChange={(e) =>
                      handleInputChange("bloodGroup", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg border border-${theme.border} bg-${theme.glass} text-${theme.text} focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={
                      isEditing
                        ? editData.nationality
                        : employee?.data?.personalInfo?.nationality || ""
                    }
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    disabled={!isEditing}
                    theme={userType}
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === "employment" && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Employment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Employee ID</Label>
                  <Input
                    value={employee?.data?.employeeId || ""}
                    disabled={true}
                    theme={userType}
                  />
                  <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                    This cannot be changed
                  </p>
                </div>

                <div>
                  <Label>Primary Email</Label>
                  <Input
                    value={employee?.data?.contactInfo?.primaryEmail || ""}
                    disabled={true}
                    theme={userType}
                  />
                  <p className={`text-xs text-${theme.textSecondary} mt-1`}>
                    Contact admin to change email
                  </p>
                </div>

                <div>
                  <Label>Date of Joining</Label>
                  <Input
                    type="date"
                    value={
                      employee?.data?.employmentInfo?.dateOfJoining?.split("T")[0] ||
                      ""
                    }
                    disabled={true}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label>Work Location</Label>
                  <Input
                    value={employee?.data?.employmentInfo?.workLocation || ""}
                    disabled={true}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label>Department</Label>
                  <Input
                    value={employee?.data?.departmentRef?.departmentName || ""}
                    disabled={true}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label>Designation</Label>
                  <Input
                    value={employee?.data?.designationRef?.designationName || ""}
                    disabled={true}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <Input
                    value={employee?.data?.roleRef?.roleName || ""}
                    disabled={true}
                    theme={userType}
                  />
                </div>

                <div>
                  <Label>Employee Status</Label>
                  <Input
                    value={employee?.data?.status?.employeeStatus || ""}
                    disabled={true}
                    theme={userType}
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === "skills" && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Skills & Certifications
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className={`font-medium text-${theme.text} mb-3`}>
                    Technical Skills
                  </h4>
                  <div className="space-y-3">
                    {mockData.skills.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium text-${theme.text}`}>
                            {skill.name}
                          </span>
                          <Badge theme={userType} variant="outline">
                            {skill.level}
                          </Badge>
                        </div>
                        <Progress
                          value={skill.progress}
                          className="h-2"
                          theme={userType}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium text-${theme.text} mb-3`}>
                    Certifications
                  </h4>
                  <div className="space-y-3">
                    {mockData.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border border-${theme.border}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className={`font-medium text-${theme.text}`}>
                              {cert.name}
                            </h5>
                            <p
                              className={`text-sm text-${theme.textSecondary}`}
                            >
                              Issued by: {cert.issuer}
                            </p>
                            <p
                              className={`text-xs text-${theme.textSecondary} mt-1`}
                            >
                              Date: {formatDate(cert.date)}
                            </p>
                          </div>
                          <Badge
                            theme={userType}
                            variant={cert.valid ? "success" : "destructive"}
                          >
                            {cert.valid ? "Valid" : "Expired"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "performance" && (
            <Card theme={userType} className="p-6">
              <h3 className={`text-lg font-semibold text-${theme.text} mb-4`}>
                Performance Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium text-${theme.text} mb-3`}>
                    Current Level
                  </h4>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                    <div
                      className={`w-16 h-16 rounded-full bg-${theme.accent} flex items-center justify-center mx-auto mb-3`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {mockData.performance.currentLevel}
                      </span>
                    </div>
                    <p className={`text-lg font-semibold text-${theme.text}`}>
                      Level {mockData.performance.currentLevel}
                    </p>
                    <p className={`text-sm text-${theme.textSecondary}`}>
                      {mockData.performance.totalXP} Total XP
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium text-${theme.text} mb-3`}>
                    Performance Metrics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Tasks Completed
                      </span>
                      <span className={`font-semibold text-${theme.text}`}>
                        {mockData.performance.tasksCompleted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Quality Score
                      </span>
                      <span className={`font-semibold text-${theme.text}`}>
                        {mockData.performance.qualityScore}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Avg. Task Time
                      </span>
                      <span className={`font-semibold text-${theme.text}`}>
                        {mockData.performance.averageTime}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Achievements
                      </span>
                      <span className={`font-semibold text-${theme.text}`}>
                        {mockData.performance.achievements}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card theme={userType} className="p-4">
            <h4 className={`font-medium text-${theme.text} mb-3`}>
              Profile Completion
            </h4>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${
                      2 *
                      Math.PI *
                      36 *
                      (1 -
                        (employee?.data?.systemInfo?.profileCompletionPercentage ||
                          0) /
                          100)
                    }`}
                    className={`text-${theme.accent}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold text-${theme.text}`}>
                    {employee?.data?.systemInfo?.profileCompletionPercentage || 0}%
                  </span>
                </div>
              </div>
              <p className={`text-sm text-${theme.textSecondary}`}>
                Complete your profile to unlock more features
              </p>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card theme={userType} className="p-4">
            <h4 className={`font-medium text-${theme.text} mb-3`}>
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 text-${theme.accent}`} />
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    Tasks Today
                  </span>
                </div>
                <span className={`font-semibold text-${theme.text}`}>12</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 text-${theme.accent}`} />
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    Quality Score
                  </span>
                </div>
                <span className={`font-semibold text-${theme.text}`}>94%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 text-${theme.accent}`} />
                  <span className={`text-sm text-${theme.textSecondary}`}>
                    Hours Today
                  </span>
                </div>
                <span className={`font-semibold text-${theme.text}`}>6.5h</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card theme={userType} className="p-4">
            <h4 className={`font-medium text-${theme.text} mb-3`}>
              Recent Activity
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-${theme.accent}/10 flex items-center justify-center`}
                >
                  <CheckCircle className={`w-4 h-4 text-${theme.accent}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium text-${theme.text}`}>
                    Completed task
                  </p>
                  <p className={`text-xs text-${theme.textSecondary}`}>
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-${theme.accent}/10 flex items-center justify-center`}
                >
                  <Award className={`w-4 h-4 text-${theme.accent}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium text-${theme.text}`}>
                    Earned achievement
                  </p>
                  <p className={`text-xs text-${theme.textSecondary}`}>
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
