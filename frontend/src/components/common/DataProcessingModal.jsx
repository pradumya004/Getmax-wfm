// frontend/src/components/common/DataProcessingModal.jsx

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
} from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Progress } from "../ui/Progress.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";

export const DataProcessingModal = ({
  isOpen,
  onClose,
  processingData,
  title = "Processing Data",
  onDownloadErrors,
  onViewDetails,
}) => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (processingData?.progress) {
      setProgress(processingData.progress);
    }
  }, [processingData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "processing":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertCircle;
      case "processing":
        return Loader2;
      default:
        return AlertCircle;
    }
  };

  if (!processingData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {processingData.status === "completed"
              ? "Processing Complete"
              : "Processing Data..."}
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="text-sm text-gray-400">
            {processingData.current || 0} of {processingData.total || 0} items
            processed
          </div>
        </div>

        {/* Results Summary */}
        {processingData.results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${theme.glass} p-4 text-center`}>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {processingData.results.successful || 0}
              </div>
              <div className="text-sm text-gray-400">Successful</div>
            </Card>

            <Card className={`${theme.glass} p-4 text-center`}>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {processingData.results.failed || 0}
              </div>
              <div className="text-sm text-gray-400">Failed</div>
            </Card>

            <Card className={`${theme.glass} p-4 text-center`}>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {processingData.results.warnings || 0}
              </div>
              <div className="text-sm text-gray-400">Warnings</div>
            </Card>
          </div>
        )}

        {/* Processing Steps */}
        {processingData.steps && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Processing Steps</h4>
            {processingData.steps.map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <StatusIcon
                    className={`w-5 h-5 ${getStatusColor(step.status)} ${
                      step.status === "processing" ? "animate-spin" : ""
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{step.title}</div>
                    {step.description && (
                      <div className="text-sm text-gray-400">
                        {step.description}
                      </div>
                    )}
                  </div>
                  <Badge
                    className={`${
                      step.status === "success"
                        ? "bg-green-500/20 text-green-300"
                        : step.status === "error"
                        ? "bg-red-500/20 text-red-300"
                        : step.status === "warning"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {step.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Details */}
        {processingData.errors && processingData.errors.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Errors</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {processingData.errors.slice(0, 5).map((error, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="text-red-300 font-medium">
                    {error.message}
                  </div>
                  {error.details && (
                    <div className="text-sm text-red-400 mt-1">
                      {error.details}
                    </div>
                  )}
                </div>
              ))}
              {processingData.errors.length > 5 && (
                <div className="text-sm text-gray-400 text-center">
                  And {processingData.errors.length - 5} more errors...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {processingData.errors && processingData.errors.length > 0 && (
              <Button
                variant="outline"
                onClick={onDownloadErrors}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Errors</span>
              </Button>
            )}

            {onViewDetails && (
              <Button
                variant="outline"
                onClick={onViewDetails}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Button>
            )}
          </div>

          <Button
            onClick={onClose}
            disabled={processingData.status === "processing"}
          >
            {processingData.status === "processing" ? "Processing..." : "Close"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
