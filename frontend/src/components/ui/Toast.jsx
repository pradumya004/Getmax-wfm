// frontend/src/components/ui/toast.jsx

// This is optional since we're using react-hot-toast, but here's a custom implementation
import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastTypes = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
};

export const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastTypes[type] || toastTypes.info;
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}
    >
      <div
        className={`
        max-w-sm p-4 rounded-lg border backdrop-blur-xl
        ${config.bg} ${config.border}
      `}
      >
        <div className="flex items-start space-x-3">
          <IconComponent
            className={`w-5 h-5 ${config.text} mt-0.5 flex-shrink-0`}
          />
          <div className="flex-1 min-w-0">
            {title && (
              <p className={`font-medium ${config.text} mb-1`}>{title}</p>
            )}
            <p className="text-white text-sm">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
};
