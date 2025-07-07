// frontend/src/pages/employee/EmployeeProfile.jsx

import React from "react";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserCheck,
  Clock3,
  BadgePercent,
  Layers,
  DollarSign,
  Timer,
  Globe2,
  ShieldCheck,
  Users,
  Star,
  HeartPulse,
} from "lucide-react";

const sampleEmployee = {
  employeeId: "EMP-AB12CD34",
  companyRef: "64f2323ed1fbd23312345678", // ObjectId ref
  roleRef: { roleName: "AR Caller" },
  departmentRef: { departmentName: "Revenue Cycle" },
  subdepartmentRef: { subDepartmentName: "Eligibility Verification" },
  designationRef: { designationName: "Senior Executive" },

  personalInfo: {
    firstName: "John",
    middleName: "R.",
    lastName: "Doe",
    displayName: "Johnny D",
    dateOfBirth: "1990-06-15",
    gender: "Male",
    bloodGroup: "O+",
  },

  contactInfo: {
    primaryEmail: "john.doe@getmax.com",
    personalEmail: "john.personal@gmail.com",
    primaryPhone: "+91 9876543210",
    alternatePhone: "+1 4081234567",
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Sister",
      phone: "+91 9876540000",
    },
  },

  employmentInfo: {
    employeeCode: "JDOE90",
    dateOfJoining: "2022-02-01",
    employmentType: "Full Time",
    workLocation: "Hybrid",
    shiftType: "Night",
  },

  reportingStructure: {
    directManager: { personalInfo: { displayName: "Emily Smith" } },
    teamLead: { personalInfo: { displayName: "Alex Johnson" } },
  },

  compensation: {
    baseSalary: 600000,
    hourlyRate: 350,
    currency: "INR",
    payFrequency: "Monthly",
  },

  workSchedule: {
    standardHours: {
      startTime: "20:00",
      endTime: "05:00",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      totalHoursPerWeek: 45,
    },
    timeZone: "IST",
    flexibleHours: true,
  },

  performanceTargets: {
    dailyClaimTarget: 35,
    qualityTarget: 95,
    slaTarget: 97,
    performanceRating: "Exceeds Expectations",
  },

  sowAssignments: [
    {
      sowRef: { sowTitle: "US Ambulance Billing - East Coast" },
      assignedDate: "2023-01-01",
      isActive: true,
    },
  ],
  rampPercentage: 90,

  skillsAndQualifications: {
    technicalSkills: [
      { skill: "React", level: "Expert", certifiedDate: "2022-05-10" },
      { skill: "Node.js", level: "Advanced" },
      { skill: "MongoDB", level: "Advanced" },
    ],
    softSkills: [
      { skill: "Communication", level: "Expert" },
      { skill: "Leadership", level: "Intermediate" },
    ],
    certifications: [
      {
        name: "Medical Billing Certification",
        issuingOrganization: "AAPC",
        issueDate: "2021-11-01",
        expiryDate: "2024-11-01",
        certificateNumber: "MB123456",
      },
    ],
    education: [
      {
        degree: "B.Sc",
        institution: "XYZ University",
        fieldOfStudy: "Health Information",
        graduationYear: 2012,
        gpa: 3.8,
      },
    ],
    languages: [
      { languages: "English", proficiency: "Fluent" },
      { languages: "Tamil", proficiency: "Native" },
    ],
  },

  authentication: {
    lastLogin: "2024-12-30T20:30:00Z",
  },

  status: {
    employeeStatus: "Active",
    statusEffectiveDate: "2024-01-01",
  },

  systemInfo: {
    isActive: true,
    emailVerified: true,
    lastLogin: "2024-12-30T20:30:00Z",
    loginCount: 118,
    profileCompletionPercentage: 92,
  },

  auditInfo: {
    createdBy: { personalInfo: { displayName: "Admin User" } },
    lastModifiedBy: { personalInfo: { displayName: "HR Manager" } },
    lastModifiedAt: "2024-12-28T16:00:00Z",
  },
};

const employee = sampleEmployee; // Replace with actual employee data from props or context

export default function EmployeeProfilePage() {
  const fullName = `${employee.personalInfo?.firstName || ""} ${
    employee.personalInfo?.middleName || ""
  } ${employee.personalInfo?.lastName || ""}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6 py-12 space-y-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <section className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-black flex items-center justify-center text-xl font-bold shadow-lg">
            {employee.personalInfo?.firstName?.[0]}
            {employee.personalInfo?.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{fullName}</h1>
            <p className="text-emerald-400">
              {employee.designationRef?.designationName}
            </p>
            <p className="text-sm text-slate-300">
              {employee.departmentRef?.departmentName} /{" "}
              {employee.roleRef?.roleName}
            </p>
          </div>
        </section>

        {/* Basic Info */}
        <GridSection title="Personal & Contact Information">
          <InfoCard
            icon={Mail}
            label="Primary Email"
            value={employee.contactInfo?.primaryEmail}
          />
          <InfoCard
            icon={Mail}
            label="Personal Email"
            value={employee.contactInfo?.personalEmail}
          />
          <InfoCard
            icon={Phone}
            label="Primary Phone"
            value={employee.contactInfo?.primaryPhone}
          />
          <InfoCard
            icon={Phone}
            label="Alternate Phone"
            value={employee.contactInfo?.alternatePhone}
          />
          <InfoCard
            icon={Calendar}
            label="Date of Birth"
            value={formatDate(employee.personalInfo?.dateOfBirth)}
          />
          <InfoCard
            icon={HeartPulse}
            label="Blood Group"
            value={employee.personalInfo?.bloodGroup}
          />
          <InfoCard
            icon={UserCheck}
            label="Gender"
            value={employee.personalInfo?.gender}
          />
          <InfoCard
            icon={Phone}
            label="Emergency Contact"
            value={`${employee.contactInfo?.emergencyContact?.name} (${employee.contactInfo?.emergencyContact?.relationship}) - ${employee.contactInfo?.emergencyContact?.phone}`}
          />
        </GridSection>

        {/* Employment Info */}
        <GridSection title="Employment & Work Details">
          <InfoCard
            icon={Briefcase}
            label="Employee Code"
            value={employee.employmentInfo?.employeeCode}
          />
          <InfoCard
            icon={Calendar}
            label="Joining Date"
            value={formatDate(employee.employmentInfo?.dateOfJoining) || "N/A"}
          />
          <InfoCard
            icon={Layers}
            label="Employment Type"
            value={employee.employmentInfo?.employmentType}
          />
          <InfoCard
            icon={MapPin}
            label="Location"
            value={employee.employmentInfo?.workLocation}
          />
          <InfoCard
            icon={Clock3}
            label="Shift Type"
            value={employee.employmentInfo?.shiftType}
          />
          <InfoCard
            icon={Globe2}
            label="Time Zone"
            value={employee.workSchedule?.timeZone}
          />
          <InfoCard
            icon={ShieldCheck}
            label="Flexible Hours"
            value={employee.workSchedule?.flexibleHours ? "Yes" : "No"}
          />
          <InfoCard
            icon={Timer}
            label="Working Days"
            value={employee.workSchedule?.standardHours?.workingDays?.join(
              ", "
            )}
          />
          <InfoCard
            icon={Timer}
            label="Work Time"
            value={`${employee.workSchedule?.standardHours?.startTime} - ${employee.workSchedule?.standardHours?.endTime}`}
          />
        </GridSection>

        {/* Reporting and Compensation */}
        <GridSection title="Reporting & Compensation">
          <InfoCard
            icon={Users}
            label="Manager"
            value={
              employee.reportingStructure?.directManager?.personalInfo
                ?.displayName || "N/A"
            }
          />
          <InfoCard
            icon={Users}
            label="Team Lead"
            value={
              employee.reportingStructure?.teamLead?.personalInfo?.displayName
            }
          />
          <InfoCard
            icon={DollarSign}
            label="Base Salary"
            value={`${employee.compensation?.baseSalary} ${employee.compensation?.currency}`}
          />
          <InfoCard
            icon={DollarSign}
            label="Hourly Rate"
            value={employee.compensation?.hourlyRate}
          />
          <InfoCard
            icon={DollarSign}
            label="Pay Frequency"
            value={employee.compensation?.payFrequency}
          />
        </GridSection>

        {/* Performance & SOW */}
        <GridSection title="Performance & Assignment">
          <InfoCard
            icon={BadgePercent}
            label="Performance Rating"
            value={employee.performanceTargets?.performanceRating}
          />
          <InfoCard
            icon={Star}
            label="Daily Claim Target"
            value={employee.performanceTargets?.dailyClaimTarget}
          />
          <InfoCard
            icon={Star}
            label="Quality Target"
            value={employee.performanceTargets?.qualityTarget + "%"}
          />
          <InfoCard
            icon={Star}
            label="SLA Target"
            value={employee.performanceTargets?.slaTarget + "%"}
          />
          <InfoCard
            icon={Layers}
            label="Ramp %"
            value={`${employee.rampPercentage}%`}
          />
          <InfoCard
            icon={Briefcase}
            label="SOW Active"
            value={
              employee.sowAssignments?.find((s) => s.isActive)?.sowRef?.sowTitle
            }
          />
        </GridSection>

        {/* Skills */}
        <GridSection title="Skills & Education">
          <InfoCard
            icon={Star}
            label="Tech Skills"
            value={employee.skillsAndQualifications?.technicalSkills
              ?.map((t) => `${t.skill} (${t.level})`)
              .join(", ")}
          />
          <InfoCard
            icon={Star}
            label="Soft Skills"
            value={employee.skillsAndQualifications?.softSkills
              ?.map((t) => `${t.skill} (${t.level})`)
              .join(", ")}
          />
          <InfoCard
            icon={Star}
            label="Certifications"
            value={employee.skillsAndQualifications?.certifications
              ?.map((c) => `${c.name} (${c.issuingOrganization})`)
              .join(", ")}
          />
          <InfoCard
            icon={Star}
            label="Education"
            value={employee.skillsAndQualifications?.education
              ?.map(
                (e) =>
                  `${e.degree} in ${e.fieldOfStudy} (${e.institution}, ${e.graduationYear})`
              )
              .join(", ")}
          />
          <InfoCard
            icon={Star}
            label="Languages"
            value={employee.skillsAndQualifications?.languages
              ?.map((l) => `${l.languages} (${l.proficiency})`)
              .join(", ")}
          />
        </GridSection>

        {/* System Info */}
        <GridSection title="System & Account Info">
          <InfoCard
            label="Last Login"
            value={formatDateTime(employee.systemInfo?.lastLogin)}
          />
          <InfoCard
            label="Login Count"
            value={employee.systemInfo?.loginCount}
          />
          <InfoCard
            label="Email Verified"
            value={employee.systemInfo?.emailVerified ? "Yes" : "No"}
          />
          <InfoCard
            label="Profile Completion"
            value={`${employee.systemInfo?.profileCompletionPercentage || 0}%`}
          />
        </GridSection>

        {/* Audit Info */}
        <GridSection title="Audit Trail">
          <InfoCard
            label="Created By"
            value={employee.auditInfo?.createdBy?.personalInfo?.displayName}
          />
          <InfoCard
            label="Last Modified By"
            value={
              employee.auditInfo?.lastModifiedBy?.personalInfo?.displayName
            }
          />
          <InfoCard
            label="Last Modified At"
            value={formatDateTime(employee.auditInfo?.lastModifiedAt)}
          />
        </GridSection>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
      {Icon && <Icon className="text-emerald-400" size={18} />}
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="text-white font-medium text-sm break-words max-w-xs">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}

function GridSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
}

function formatDateTime(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString() : "-";
}
