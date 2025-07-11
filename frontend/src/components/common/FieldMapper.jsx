// frontend/src/components/common/FieldMapper.jsx

import React from "react";
import { ArrowRight, Link, Unlink } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Select } from "../ui/Select.jsx";
import { Badge } from "../ui/Badge.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const FieldMapper = ({
  sourceFields,
  targetFields,
  mappings,
  onMappingChange,
  requiredFields = [],
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const getMappingStatus = (targetField) => {
    const mapping = mappings[targetField];
    if (!mapping) return "unmapped";
    if (sourceFields.includes(mapping)) return "mapped";
    return "invalid";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "mapped":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "unmapped":
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
      case "invalid":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "mapped":
        return Link;
      case "unmapped":
        return Unlink;
      case "invalid":
        return Unlink;
      default:
        return Unlink;
    }
  };

  return (
    <Card className={`${theme.card} p-6`}>
      <h3 className="text-white text-lg font-semibold mb-6">Field Mapping</h3>

      <div className="space-y-4">
        {Object.entries(targetFields).map(([fieldKey, fieldInfo]) => {
          const status = getMappingStatus(fieldKey);
          const StatusIcon = getStatusIcon(status);

          return (
            <div
              key={fieldKey}
              className={`p-4 rounded-lg border ${
                requiredFields.includes(fieldKey)
                  ? "border-yellow-400/30 bg-yellow-500/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <StatusIcon
                    className={`w-4 h-4 ${
                      status === "mapped" ? "text-green-400" : "text-gray-400"
                    }`}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">
                        {fieldInfo.label || fieldKey}
                      </span>
                      {requiredFields.includes(fieldKey) && (
                        <Badge variant="warning" size="sm">
                          Required
                        </Badge>
                      )}
                    </div>
                    {fieldInfo.description && (
                      <p className={`text-${theme.textSecondary} text-sm`}>
                        {fieldInfo.description}
                      </p>
                    )}
                  </div>
                </div>

                <Badge className={getStatusColor(status)} size="sm">
                  {status}
                </Badge>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Select
                    value={mappings[fieldKey] || ""}
                    onChange={(e) => onMappingChange(fieldKey, e.target.value)}
                    options={[
                      { value: "", label: "Select source field..." },
                      ...sourceFields.map((field) => ({
                        value: field,
                        label: field,
                      })),
                    ]}
                  />
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <div className="flex-1">
                  <div
                    className={`px-3 py-2 rounded-lg ${theme.input} border border-white/20`}
                  >
                    <span className="text-white">
                      {fieldInfo.label || fieldKey}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Link className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-medium">Mapping Status</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white">
              {
                Object.values(mappings).filter(
                  (m) => m && sourceFields.includes(m)
                ).length
              }{" "}
              Mapped
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-white">
              {Object.keys(targetFields).length -
                Object.values(mappings).filter(
                  (m) => m && sourceFields.includes(m)
                ).length}{" "}
              Unmapped
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white">
              {
                requiredFields.filter(
                  (field) =>
                    !mappings[field] || !sourceFields.includes(mappings[field])
                ).length
              }{" "}
              Required Missing
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};