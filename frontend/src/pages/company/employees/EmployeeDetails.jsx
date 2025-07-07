// frontend/src/pages/company/employees/EmployeeDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Star,
  Award,
  TrendingUp,
  Clock,
  Globe,
  Shield,
  Target,
  Zap,
  Trophy,
  Medal,
  User,
  UserCheck,
  Heart,
  Building,
  Layers,
  Timer,
  ChevronRight,
  Copy,
  Download,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { employeeAPI } from "../../../api/employee.api.js";
import { getTheme } from "../../../lib/theme.js";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner.jsx";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployeeDetails(employeeId);
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "inactive":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "probation":
        return "text-orange-400 bg-orange-400/20 border-orange-400/30";
      default:
        return `text-${theme.textSecondary} bg-${theme.accent}/20 border-${theme.accent}/30`;
    }
  };

  const getRankIcon = (rank) => {
    switch (rank?.toLowerCase()) {
      case "guardian":
        return "🛡️";
      case "elite":
        return "👑";
      case "pro":
        return "⭐";
      case "master":
        return "🏆";
      default:
        return "🔰";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "skills", label: "Skills", icon: Award },
    { id: "gamification", label: "Gamification", icon: Trophy },
  ];

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
      >
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
          <p className={`text-${theme.textSecondary} mb-4`}>
            The requested employee could not be found.
          </p>
          <Button onClick={() => navigate("/company/employees")}>
            Back to Employees
          </Button>
        </Card>
      </div>
    );
  }

  const fullName = [
    employee.personalInfo?.firstName,
    employee.personalInfo?.middleName,
    employee.personalInfo?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.primary} p-6`}>
      <Helmet>
        <title>Employee Details - {fullName}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/company/employees")}
              className="inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Employees</span>
            </Button>
            <div className="h-6 border-l border-white/20"></div>
            <h1 className="text-2xl font-bold text-white">Employee Details</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/company/employees/edit/${employee.employeeId}`)
              }
              className="inline-flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Employee</span>
            </Button>
            <Button variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Employee Header Card */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="relative">
                {employee.personalInfo?.profilePicture ? (
                  <img
                    src={employee.avatarUrl}
                    alt={fullName}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                  />
                ) : (
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20`}
                  >
                    {employee.personalInfo?.firstName?.charAt(0)}
                    {employee.personalInfo?.lastName?.charAt(0)}
                  </div>
                )}
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br ${theme.secondary} rounded-lg flex items-center justify-center border-2 border-white/20`}
                >
                  {getRankIcon(employee.gamification?.rank?.currentRank)}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {fullName}
                </h2>
                <p className={`text-${theme.accent} font-medium mb-1`}>
                  {employee.designationRef?.designationName ||
                    "No designation assigned"}
                </p>
                <div className="flex items-center space-x-4 mb-3">
                  <span
                    className={`text-${theme.textSecondary} flex items-center`}
                  >
                    <Building className="w-4 h-4 mr-1" />
                    {employee.departmentRef?.departmentName || "No department"}
                  </span>
                  <span
                    className={`text-${theme.textSecondary} flex items-center`}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    {employee.roleRef?.roleName || "No role"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(
                      employee.status?.employeeStatus
                    )}`}
                  >
                    {employee.status?.employeeStatus || "Unknown"}
                  </span>
                  <span
                    className={`text-${theme.textSecondary} flex items-center text-sm`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {formatDate(employee.employmentInfo?.dateOfJoining)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-${theme.textSecondary} text-sm mb-1`}>
                Employee ID
              </p>
              <div className="flex items-center space-x-2">
                <code className={`text-${theme.text} font-mono font-medium`}>
                  {employee.employeeId}
                </code>
                <button
                  onClick={() => copyToClipboard(employee.employeeId)}
                  className={`p-1 hover:bg-${theme.accent}/20 rounded`}
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="mt-4">
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Profile Completion
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-16 h-2 bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-300`}
                      style={{
                        width: `${
                          employee.systemInfo?.profileCompletionPercentage || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className={`text-${theme.text} text-sm font-medium`}>
                    {employee.systemInfo?.profileCompletionPercentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-black/20 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-${theme.accent}/20 text-${theme.text} border border-${theme.accent}/30`
                  : `text-${theme.textSecondary} hover:bg-white/5`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      First Name
                    </label>
                    <p className="text-white font-medium">
                      {employee.personalInfo?.firstName}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Last Name
                    </label>
                    <p className="text-white font-medium">
                      {employee.personalInfo?.lastName}
                    </p>
                  </div>
                </div>
                {employee.personalInfo?.middleName && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Middle Name
                    </label>
                    <p className="text-white font-medium">
                      {employee.personalInfo.middleName}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Date of Birth
                    </label>
                    <p className="text-white font-medium">
                      {formatDate(employee.personalInfo?.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Age
                    </label>
                    <p className="text-white font-medium">
                      {employee.age || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Gender
                    </label>
                    <p className="text-white font-medium">
                      {employee.personalInfo?.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Blood Group
                    </label>
                    <p className="text-white font-medium">
                      {employee.personalInfo?.bloodGroup || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Primary Email
                  </label>
                  <p className="text-white font-medium">
                    {employee.contactInfo?.primaryEmail}
                  </p>
                </div>
                {employee.contactInfo?.personalEmail && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Personal Email
                    </label>
                    <p className="text-white font-medium">
                      {employee.contactInfo.personalEmail}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Primary Phone
                    </label>
                    <p className="text-white font-medium">
                      {employee.contactInfo?.primaryPhone}
                    </p>
                  </div>
                  {employee.contactInfo?.alternatePhone && (
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Alternate Phone
                      </label>
                      <p className="text-white font-medium">
                        {employee.contactInfo.alternatePhone}
                      </p>
                    </div>
                  )}
                </div>
                {employee.contactInfo?.emergencyContact && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Emergency Contact
                    </label>
                    <div className={`text-${theme.textSecondary} mt-1`}>
                      <p className="text-white font-medium">
                        {employee.contactInfo.emergencyContact.name}
                      </p>
                      <p>
                        {employee.contactInfo.emergencyContact.relationship}
                      </p>
                      <p>{employee.contactInfo.emergencyContact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                  <Trophy
                    className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                  />
                  <p className="text-2xl font-bold text-white">
                    {employee.gamification?.experience?.currentLevel || 1}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Current Level
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                  <Zap
                    className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                  />
                  <p className="text-2xl font-bold text-white">
                    {employee.gamification?.experience?.totalXP || 0}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Total XP
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                  <Target
                    className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                  />
                  <p className="text-2xl font-bold text-white">
                    {employee.performanceTargets?.dailyClaimTarget || 0}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Daily Target
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme.glass} text-center`}>
                  <Star
                    className={`w-8 h-8 mx-auto mb-2 text-${theme.accent}`}
                  />
                  <p className="text-2xl font-bold text-white">
                    {employee.performanceTargets?.qualityTarget || 0}%
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    Quality Target
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "employment" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Employment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Employee Code
                  </label>
                  <p className="text-white font-medium">
                    {employee.employmentInfo?.employeeCode || "Not assigned"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Date of Joining
                    </label>
                    <p className="text-white font-medium">
                      {formatDate(employee.employmentInfo?.dateOfJoining)}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Employment Type
                    </label>
                    <p className="text-white font-medium">
                      {employee.employmentInfo?.employmentType ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Work Location
                    </label>
                    <p className="text-white font-medium">
                      {employee.employmentInfo?.workLocation || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Shift Type
                    </label>
                    <p className="text-white font-medium">
                      {employee.employmentInfo?.shiftType || "Not specified"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Probation Period
                  </label>
                  <p className="text-white font-medium">
                    {employee.employmentInfo?.probationPeriod?.duration
                      ? `${employee.employmentInfo.probationPeriod.duration} ${employee.employmentInfo.probationPeriod.unit}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Compensation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Compensation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Base Salary
                  </label>
                  <p className="text-white font-medium text-xl">
                    {employee.compensation?.currency}{" "}
                    {employee.compensation?.baseSalary?.toLocaleString() ||
                      "Not specified"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Hourly Rate
                    </label>
                    <p className="text-white font-medium">
                      {employee.compensation?.hourlyRate
                        ? `${employee.compensation.currency} ${employee.compensation.hourlyRate}`
                        : "Not applicable"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Pay Frequency
                    </label>
                    <p className="text-white font-medium">
                      {employee.compensation?.payFrequency || "Not specified"}
                    </p>
                  </div>
                </div>
                {employee.compensation?.benefits?.length > 0 && (
                  <div>
                    <label
                      className={`text-${theme.textSecondary} text-sm mb-2 block`}
                    >
                      Benefits
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {employee.compensation.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Reporting Structure */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Reporting Structure
              </h3>
              <div className="space-y-4">
                {employee.reportingStructure?.directManager && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Direct Manager
                    </label>
                    <p className="text-white font-medium">
                      {employee.reportingStructure.directManager.personalInfo
                        ?.displayName ||
                        `${employee.reportingStructure.directManager.personalInfo?.firstName} ${employee.reportingStructure.directManager.personalInfo?.lastName}`}
                    </p>
                  </div>
                )}
                {employee.reportingStructure?.teamLead && (
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Team Lead
                    </label>
                    <p className="text-white font-medium">
                      {employee.reportingStructure.teamLead.personalInfo
                        ?.displayName ||
                        `${employee.reportingStructure.teamLead.personalInfo?.firstName} ${employee.reportingStructure.teamLead.personalInfo?.lastName}`}
                    </p>
                  </div>
                )}
                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Ramp Percentage
                  </label>
                  <p className="text-white font-medium">
                    {employee.rampPercentage || 100}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Work Schedule */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Work Schedule
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Time Zone
                    </label>
                    <p className="text-white font-medium">
                      {employee.workSchedule?.timeZone || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Flexible Hours
                    </label>
                    <p className="text-white font-medium">
                      {employee.workSchedule?.flexibleHours ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                {employee.workSchedule?.standardHours && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`text-${theme.textSecondary} text-sm`}
                        >
                          Start Time
                        </label>
                        <p className="text-white font-medium">
                          {employee.workSchedule.standardHours.startTime ||
                            "Not specified"}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-${theme.textSecondary} text-sm`}
                        >
                          End Time
                        </label>
                        <p className="text-white font-medium">
                          {employee.workSchedule.standardHours.endTime ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>
                    {employee.workSchedule.standardHours.workingDays?.length >
                      0 && (
                      <div>
                        <label
                          className={`text-${theme.textSecondary} text-sm mb-2 block`}
                        >
                          Working Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {employee.workSchedule.standardHours.workingDays.map(
                            (day, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                              >
                                {day}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Targets */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Targets
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Daily Claim Target
                    </label>
                    <p className="text-2xl font-bold text-white">
                      {employee.performanceTargets?.dailyClaimTarget || 0}
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Quality Target
                    </label>
                    <p className="text-2xl font-bold text-white">
                      {employee.performanceTargets?.qualityTarget || 0}%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      SLA Target
                    </label>
                    <p className="text-2xl font-bold text-white">
                      {employee.performanceTargets?.slaTarget || 0}%
                    </p>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Performance Rating
                    </label>
                    <p className="text-2xl font-bold text-white">
                      {employee.performanceTargets?.performanceRating ||
                        "Not rated"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* SOW Assignments */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                SOW Assignments
              </h3>
              <div className="space-y-3">
                {employee.sowAssignments?.length > 0 ? (
                  employee.sowAssignments.map((assignment, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${theme.glass} flex items-center justify-between`}
                    >
                      <div>
                        <p className="text-white font-medium">
                          {assignment.sowRef?.sowTitle ||
                            `SOW ${assignment.sowRef}`}
                        </p>
                        <p className={`text-${theme.textSecondary} text-sm`}>
                          Assigned: {formatDate(assignment.assignedDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            assignment.isActive
                              ? "bg-green-400/20 text-green-400"
                              : "bg-red-400/20 text-red-400"
                          } border`}
                        >
                          {assignment.isActive ? "Active" : "Inactive"}
                        </span>
                        <p
                          className={`text-${theme.textSecondary} text-sm mt-1`}
                        >
                          Ramp: {assignment.rampPercentage || 100}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-${theme.textSecondary} text-center py-4`}>
                    No SOW assignments
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Skills */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Technical Skills
              </h3>
              <div className="space-y-3">
                {employee.skillsAndQualifications?.technicalSkills?.length >
                0 ? (
                  employee.skillsAndQualifications.technicalSkills.map(
                    (skill, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${theme.glass} flex items-center justify-between`}
                      >
                        <span className="text-white font-medium">
                          {skill.skill}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className={`text-${theme.textSecondary} text-center py-4`}>
                    No technical skills recorded
                  </p>
                )}
              </div>
            </Card>

            {/* Soft Skills & Languages */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Soft Skills & Languages
              </h3>
              <div className="space-y-4">
                {employee.skillsAndQualifications?.softSkills?.length > 0 && (
                  <div>
                    <label
                      className={`text-${theme.textSecondary} text-sm mb-2 block`}
                    >
                      Soft Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {employee.skillsAndQualifications.softSkills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${theme.badge} border`}
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
                {employee.skillsAndQualifications?.languages?.length > 0 && (
                  <div>
                    <label
                      className={`text-${theme.textSecondary} text-sm mb-2 block`}
                    >
                      Languages
                    </label>
                    <div className="space-y-2">
                      {employee.skillsAndQualifications.languages.map(
                        (lang, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded ${theme.glass} flex items-center justify-between`}
                          >
                            <span className="text-white">{lang.language}</span>
                            <span
                              className={`text-${theme.textSecondary} text-sm`}
                            >
                              {lang.proficiency}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Certifications */}
            {employee.skillsAndQualifications?.certifications?.length > 0 && (
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Medal className="w-5 h-5 mr-2" />
                  Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employee.skillsAndQualifications.certifications.map(
                    (cert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${theme.glass}`}
                      >
                        <h4 className="text-white font-medium mb-1">
                          {cert.name}
                        </h4>
                        <p
                          className={`text-${theme.textSecondary} text-sm mb-2`}
                        >
                          Issued by: {cert.issuingOrganization}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            {formatDate(cert.issueDate)}
                          </span>
                          {cert.expiryDate && (
                            <span
                              className={`text-${theme.textSecondary} text-sm`}
                            >
                              Expires: {formatDate(cert.expiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "gamification" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience & Level */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Experience & Level
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`w-20 h-20 mx-auto bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2`}
                  >
                    {employee.gamification?.experience?.currentLevel || 1}
                  </div>
                  <p className="text-white font-medium">
                    Level {employee.gamification?.experience?.currentLevel || 1}
                  </p>
                  <p className={`text-${theme.textSecondary} text-sm`}>
                    {employee.gamification?.experience?.totalXP || 0} Total XP
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      Progress to Next Level
                    </span>
                    <span className={`text-${theme.textSecondary} text-sm`}>
                      {employee.gamification?.experience?.xpToNextLevel || 0} XP
                      remaining
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-300`}
                      style={{
                        width: `${Math.max(
                          0,
                          100 -
                            (employee.gamification?.experience?.xpToNextLevel ||
                              100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className={`text-${theme.textSecondary} text-sm`}>
                    Current Rank
                  </label>
                  <p className="text-white font-medium flex items-center">
                    {getRankIcon(employee.gamification?.rank?.currentRank)}
                    <span className="ml-2">
                      {employee.gamification?.rank?.currentRank || "Rookie"}
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Achievements & Streaks */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Achievements & Streaks
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                    <p className="text-xl font-bold text-white">
                      {employee.gamification?.streaks
                        ?.currentProductivityStreak || 0}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Productivity Streak
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                    <p className="text-xl font-bold text-white">
                      {employee.gamification?.streaks?.currentQualityStreak ||
                        0}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Quality Streak
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                    <p className="text-xl font-bold text-white">
                      {employee.gamification?.streaks?.loginStreak || 0}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Login Streak
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme.glass} text-center`}>
                    <p className="text-xl font-bold text-white">
                      {employee.gamification?.coins || 0}
                    </p>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      Coins Earned
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Rewards */}
            {employee.gamification?.rewards?.length > 0 && (
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Medal className="w-5 h-5 mr-2" />
                  Recent Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employee.gamification.rewards
                    .slice(0, 6)
                    .map((reward, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${theme.glass}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium">
                            {reward.rewardName}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              reward.status === "Earned"
                                ? "bg-green-400/20 text-green-400"
                                : reward.status === "Claimed"
                                ? "bg-blue-400/20 text-blue-400"
                                : "bg-red-400/20 text-red-400"
                            } border`}
                          >
                            {reward.status}
                          </span>
                        </div>
                        <p
                          className={`text-${theme.textSecondary} text-sm mb-2`}
                        >
                          {reward.description}
                        </p>
                        <p className={`text-${theme.textSecondary} text-xs`}>
                          {formatDate(reward.earnedDate)}
                        </p>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
