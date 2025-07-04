// frontend/src/components/admin/SuspendCompanyModal.jsx

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { adminAPI } from "../../api/admin.api.js";
import { toast } from "react-hot-toast";

export const SuspendCompanyModal = ({
  isOpen,
  onClose,
  company,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    setLoading(true);
    try {
      await adminAPI.suspendCompany(company.companyId);
      toast.success(`${company.companyName} has been suspended`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to suspend company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend Company">
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium">Warning</p>
            <p className="text-red-200 text-sm">
              This will suspend <strong>{company?.companyName}</strong> and
              disable access for all their employees.
            </p>
          </div>
        </div>

        <Input
          label="Reason for Suspension"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for suspension..."
          theme="admin"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            theme="admin"
            loading={loading}
            onClick={handleSuspend}
            className="flex-1"
          >
            Suspend Company
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};