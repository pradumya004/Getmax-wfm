// frontend/src/components/organization/OrgDataTable.jsx

import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { DataTable } from "../common/DataTable.jsx";
import { Button } from "../ui/Button.jsx";
import { ConfirmDialog } from "../common/ConfirmDialog.jsx";
import { formatDate } from "../../lib/utils.js";

export const OrgDataTable = ({
  data,
  type, // 'roles', 'departments', 'designations', 'subdepartments'
  onAdd,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [deleteItem, setDeleteItem] = useState(null);

  const getColumns = () => {
    const baseColumns = [
      { key: "name", label: "Name" },
      { key: "code", label: "Code" },
      { key: "description", label: "Description" },
    ];

    switch (type) {
      case "roles":
        return [
          { key: "roleName", label: "Role Name" },
          { key: "roleCode", label: "Code" },
          { key: "roleLevel", label: "Level" },
          { key: "description", label: "Description" },
          {
            key: "createdAt",
            label: "Created",
            render: (value) => formatDate(value, "short"),
          },
        ];
      case "departments":
        return [
          { key: "departmentName", label: "Department Name" },
          { key: "departmentCode", label: "Code" },
          { key: "costCenter", label: "Cost Center" },
          { key: "description", label: "Description" },
          {
            key: "createdAt",
            label: "Created",
            render: (value) => formatDate(value, "short"),
          },
        ];
      case "designations":
        return [
          { key: "designationName", label: "Designation Name" },
          { key: "designationCode", label: "Code" },
          { key: "level", label: "Level" },
          { key: "category", label: "Category" },
          {
            key: "createdAt",
            label: "Created",
            render: (value) => formatDate(value, "short"),
          },
        ];
      default:
        return baseColumns;
    }
  };

  const handleDelete = async () => {
    if (deleteItem) {
      await onDelete(deleteItem._id);
      setDeleteItem(null);
    }
  };

  const getSearchFields = () => {
    switch (type) {
      case "roles":
        return ["roleName", "roleCode"];
      case "departments":
        return ["departmentName", "departmentCode"];
      case "designations":
        return ["designationName", "designationCode"];
      default:
        return ["name", "code"];
    }
  };

  const actions = (row) => (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        onClick={() => onEdit(row)}
        className="p-2 hover:bg-blue-500/20"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setDeleteItem(row)}
        className="p-2 hover:bg-red-500/20 text-red-400"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Button
          onClick={onAdd}
          theme="company"
          className="inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add {type.slice(0, -1)}</span>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={getColumns()}
        searchFields={getSearchFields()}
        theme="company"
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Management`}
        actions={actions}
      />

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete this ${type.slice(
          0,
          -1
        )}? This action cannot be undone.`}
        type="danger"
      />
    </>
  );
};
