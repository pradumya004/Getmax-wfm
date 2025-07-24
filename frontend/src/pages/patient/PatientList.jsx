import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  User, Plus, Upload, Search, Edit, Trash2, Eye
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/common/DataTable.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { Input } from "../../components/ui/Input.jsx"; // Import Input for search
import { usePatients } from "../../hooks/usePatients.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/utils.js";
import { useDebounce } from "../../hooks/useDebounce.jsx"; // Assuming a debounce hook

const PatientList = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const navigate = useNavigate();
  // Get the new pagination state and loadPatients function from the hook
  const { patients, pagination, loading, error, deletePatient, loadPatients } =
    usePatients();

  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  
  // State for server-side operations
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState({ sortBy: 'personalInfo.firstName', sortOrder: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term

  // useEffect to fetch data when dependencies change
  useEffect(() => {
    loadPatients({
      page: currentPage,
      limit: 10, // Or get from a state if you have a page size selector
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      search: debouncedSearchTerm,
    });
  }, [currentPage, sorting, debouncedSearchTerm, loadPatients]);

  // Correctly map nested data from the patient model
  const transformedPatients = useMemo(() => {
    if (!Array.isArray(patients)) return [];

    return patients.map((p) => ({
      ...p,
      fullName: `${p.personalInfo?.firstName || ''} ${p.personalInfo?.lastName || ''}`.trim(),
      email: p.contactInfo?.email || 'N/A',
      phone: p.contactInfo?.primaryPhone || 'N/A',
      dob: p.personalInfo?.dateOfBirth,
      clientName: p.clientRef?.clientInfo?.clientName || 'N/A', // Example of fetching from ref
      status: p.activityInfo?.patientStatus || 'Active',
    }));
  }, [patients]);

  const columns = [
    {
      key: "fullName",
      label: "Patient Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${theme.secondary} rounded-full flex items-center justify-center`}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-xs text-gray-400">{row.clientName}</div>
          </div>
        </div>
      )
    },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "dob", label: "Date of Birth", sortable: true, render: (value) => formatDate(value) },
    { key: "status", label: "Status", render: (value) => <Badge variant={value === 'Active' ? 'success' : 'secondary'}>{value}</Badge> },
    {
      key: "actions",
      label: "Actions",
      render: (_, patient) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/company/patients/${patient._id}`)}><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/company/patients/${patient._id}/edit`)}><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(patient)} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
        </div>
      )
    },
  ];
  
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    await deletePatient(patientToDelete._id);
    setShowDeleteDialog(false);
  };
  
  // Handlers for server-side operations
  const handleSort = (key, order) => {
    setSorting({ sortBy: key, sortOrder: order });
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Patient Registry</title></Helmet>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Patient Registry</h1>
          <p className="text-gray-400">Manage all patient records across your clients.</p>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input 
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
            icon={<Search className="w-4 h-4 text-gray-400"/>}
          />
          <Button variant="primary" onClick={() => navigate('/company/patients/create')}>
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
        // Server-side props
        serverSide={true}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onSort={handleSort}
        // Selection props (optional)
        selectable={true}
        selectedRows={selectedPatients}
        onRowSelect={(id) =>
          setSelectedPatients((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          )
        }
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete patient "${patientToDelete?.personalInfo.firstName} ${patientToDelete?.personalInfo.lastName}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        loading={loading}
      />
    </div>
  );
};

export default PatientList;