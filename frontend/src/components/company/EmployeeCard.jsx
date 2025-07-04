// frontend/src/components/company/EmployeeCard.jsx

import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { getInitials, formatDate } from "../../lib/utils.js";

export const EmployeeCard = ({ employee, onView, onEdit, onDeactivate }) => {
  return (
    <Card theme="company" className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold">
              {getInitials(
                `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`
              )}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {employee.personalInfo?.firstName}{" "}
              {employee.personalInfo?.lastName}
            </h3>
            <p className="text-gray-400 text-sm">{employee.employeeId}</p>
          </div>
        </div>
        <Badge status={employee.systemInfo?.isActive ? "active" : "inactive"}>
          {employee.systemInfo?.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">
            {employee.contactInfo?.primaryEmail}
          </span>
        </div>
        {employee.contactInfo?.primaryPhone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">
              {employee.contactInfo.primaryPhone}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">
            Joined {formatDate(employee.employmentInfo?.dateOfJoining, "short")}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-orange-400" />
          <span className="text-gray-300">
            {employee.employmentInfo?.workLocation}
          </span>
        </div>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onView(employee)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit(employee)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          theme="company"
          onClick={() => onDeactivate(employee)}
          className="p-2"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
