// frontend/src/components/organization/designations/DesignationCard.jsx

import React from "react";
import { Briefcase, Award, Star, Edit, Trash2 } from "lucide-react";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { Badge } from "../../ui/Badge.jsx";

export const DesignationCard = ({
  designation,
  onEdit,
  onDelete,
  employeeCount = 0,
}) => {
  const getLevelIcon = (level) => {
    switch (level) {
      case "Expert":
        return Star;
      case "Advanced":
        return Award;
      case "Intermediate":
        return Briefcase;
      default:
        return Briefcase;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "text-yellow-400";
      case "Advanced":
        return "text-purple-400";
      case "Intermediate":
        return "text-blue-400";
      default:
        return "text-green-400";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technical: "from-blue-500 to-cyan-500",
      Management: "from-purple-500 to-pink-500",
      Sales: "from-green-500 to-emerald-500",
      Marketing: "from-orange-500 to-red-500",
      Operations: "from-indigo-500 to-blue-500",
      Support: "from-gray-500 to-slate-500",
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  const IconComponent = getLevelIcon(designation.level);
  const levelColor = getLevelColor(designation.level);
  const categoryGradient = getCategoryColor(designation.category);

  return (
    <Card
      theme="company"
      className="p-6 group hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-r ${categoryGradient} rounded-xl flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {designation.designationName}
            </h3>
            <p className="text-gray-400 text-sm">
              {designation.designationCode}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <Badge variant="default" className={levelColor}>
            {designation.level}
          </Badge>
          <Badge variant="default">{designation.category}</Badge>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Employees</span>
          <span className="text-white font-medium">{employeeCount}</span>
        </div>

        {designation.description && (
          <p className="text-gray-300 text-sm line-clamp-2">
            {designation.description}
          </p>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Created</span>
          <span className="text-gray-300 text-sm">
            {new Date(designation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          theme="company"
          onClick={() => onEdit(designation)}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(designation)}
          className="p-2 text-red-400 border-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};