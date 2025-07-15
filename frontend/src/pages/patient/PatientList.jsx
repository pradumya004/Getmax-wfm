// frontend/src/pages/patient/PatientList.jsx

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  User,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  List,
  Grid,
} from "lucide-react";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { DataTable } from "../../components/common/DataTable.jsx"
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { usePatients } from "../../hooks/usePatients.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDate } from "../../lib/utils.js";

const PatientList = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  const { patients, loading, error, deletePatient, uploadBulkPatients, loadPatients } =
    usePatients();

  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const transformedPatients = useMemo(() => {
    if (!patients || !Array.isArray(patients)) return [];

    return patients.map((p) => ({
      ...p,
      fullName: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      email: p.email || 'N/A',
      phone: p.phone || '',
      dob: p.dob,
      insuranceID: p.insuranceID,
      status: p.status || 'Active',
    }));
  }, [patients]);

  const columns = [
    {
      key: "fullName",
      label: "Patient Name",
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="font-medium text-white">{value}</div>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <div className="text-sm text-gray-300">{value}</div>
      )
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="text-sm text-gray-300">{value}</div>
      )
    },
    {
      key: "dob",
      label: "Date of Birth",
      render: (value) => <div className="text-sm text-gray-400">{formatDate(value)}</div>
    },
    {
      key: "insuranceID",
      label: "Insurance ID",
      render: (value) => <div className="text-sm text-gray-300">{value}</div>
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <Badge variant={value === 'Active' ? 'success' : 'secondary'}>{value}</Badge>
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, patient) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/patients/${patient._id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/patients/${patient._id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePatient(patient)}
            className="text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    await deletePatient(patientToDelete._id);
    setShowDeleteDialog(false);
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Patient List</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patients</h1>
          <p className="text-gray-400">Manage patient information and records</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/patients/upload')}>
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload
          </Button>
          <Button variant="primary" onClick={() => navigate('/patients/new')}>
            <Plus className="w-4 h-4 mr-2" /> Add Patient
          </Button>
        </div>
      </div>

      <DataTable
        data={transformedPatients}
        columns={columns}
        loading={loading}
        error={error}
        theme={theme}
        rowKey="_id"
        selectable={true}
        selectedRows={selectedPatients}
        onRowSelect={(id) =>
          setSelectedPatients((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          )
        }
        onSelectAll={(ids) => setSelectedPatients(ids)}
        searchable={true}
        searchFields={["fullName", "email", "phone", "insuranceID"]}
        searchPlaceholder="Search patients by name, email, phone..."
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete "${patientToDelete?.fullName}"?`}
        type="danger"
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  );
};

export default PatientList;
