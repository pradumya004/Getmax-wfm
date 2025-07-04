// frontend/src/components/admin/SubscriptionPlanModal.jsx

import React, { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import { SUBSCRIPTION_PLANS } from "../../lib/constants.js";
import { adminAPI } from "../../api/admin.api.js";
import { toast } from "react-hot-toast";

export const SubscriptionPlanModal = ({
  isOpen,
  onClose,
  company,
  onSuccess,
}) => {
  const [newPlan, setNewPlan] = useState(company?.subscriptionPlan || "");
  const [loading, setLoading] = useState(false);

  const planOptions = Object.values(SUBSCRIPTION_PLANS).map((plan) => ({
    value: plan,
    label: plan,
  }));

  const handleChangePlan = async () => {
    if (!newPlan || newPlan === company.subscriptionPlan) {
      toast.error("Please select a different plan");
      return;
    }

    setLoading(true);
    try {
      await adminAPI.changeSubscriptionPlan(company.companyId, newPlan);
      toast.success(`Plan changed to ${newPlan} for ${company.companyName}`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to change subscription plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Subscription Plan">
      <div className="space-y-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 font-medium">{company?.companyName}</p>
          <p className="text-blue-200 text-sm">
            Current Plan: {company?.subscriptionPlan}
          </p>
        </div>

        <Select
          label="New Subscription Plan"
          value={newPlan}
          onChange={(e) => setNewPlan(e.target.value)}
          options={planOptions}
          placeholder="Select new plan..."
        />

        <div className="flex space-x-3 pt-4">
          <Button
            theme="admin"
            loading={loading}
            onClick={handleChangePlan}
            className="flex-1"
          >
            Change Plan
          </Button>
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
