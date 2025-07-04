// frontend/src/pages/employee/ProfileCard.jsx

import React from "react";
import { User, Mail, Phone, Calendar, MapPin, Edit } from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { getInitials, formatDate } from "../../lib/utils.js";

const ProfileCard = ({ employee, onEdit, canEdit = false }) => {
  const fullName = `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`;

  return (
    <Card theme="employee" className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-lg">
              {getInitials(fullName)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{fullName}</h2>
            <p className="text-emerald-400">{employee.roleRef?.roleName}</p>
            <p className="text-gray-400 text-sm">{employee.employeeId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge status={employee.systemInfo?.isActive ? "active" : "inactive"}>
            {employee.systemInfo?.isActive ? "Active" : "Inactive"}
          </Badge>
          {canEdit && (
            <Button
              variant="outline"
              theme="employee"
              onClick={onEdit}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Work Email</p>
              <p className="text-white">{employee.contactInfo?.primaryEmail}</p>
            </div>
          </div>

          {employee.contactInfo?.primaryPhone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white">
                  {employee.contactInfo.primaryPhone}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-sm">Work Location</p>
              <p className="text-white">
                {employee.employmentInfo?.workLocation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Department</p>
              <p className="text-white">
                {employee.departmentRef?.departmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-gray-400 text-sm">Date Joined</p>
              <p className="text-white">
                {formatDate(employee.employmentInfo?.dateOfJoining, "short")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-gray-400 text-sm">Designation</p>
              <p className="text-white">
                {employee.designationRef?.designationName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
