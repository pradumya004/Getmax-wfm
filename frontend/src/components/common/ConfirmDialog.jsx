// frontend/src/components/common/ConfirmDialog.jsx

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
}) => {
  const getTypeColors = () => {
    switch (type) {
      case "danger":
        return { icon: "text-red-400", button: "admin" };
      case "warning":
        return { icon: "text-yellow-400", button: "company" };
      default:
        return { icon: "text-blue-400", button: "company" };
    }
  };

  const colors = getTypeColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start space-x-4">
        <AlertTriangle
          className={`w-6 h-6 ${colors.icon} mt-1 flex-shrink-0`}
        />
        <div className="flex-1">
          <p className="text-gray-300">{message}</p>
          <div className="flex space-x-3 mt-6">
            <Button
              variant="primary"
              theme={colors.button}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
            <Button variant="ghost" onClick={onClose} className="flex-1">
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};