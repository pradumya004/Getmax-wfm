// frontend/src/pages/company/CompanyUpdateForm.jsx

import React from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const CompanyUpdateForm = ({
  formData,
  setFormData,
  handleSave,
  handleCancel,
  loading,
}) => {
  return (
    <div>
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Legal Name"
        value={formData?.legalName}
        onChange={(e) =>
          setFormData({ ...formData, legalName: e.target.value })
        }
      />
      <Input
        label="Tax ID"
        value={formData.taxID}
        onChange={(e) => setFormData({ ...formData, taxID: e.target.value })}
      />
      <Input
        label="Website"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />
      <Input
        label="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({ ...formData, companyName: e.target.value })
        }
      />

      <div className="flex space-x-3 mt-4">
        <Button theme="company" onClick={handleSave} loading={loading}>
          Save
        </Button>
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CompanyUpdateForm;
