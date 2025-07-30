// frontend/src/pages/employee/PayerList.jsx

import React, { useState, useMemo } from "react";
import { Building2, Shield, Globe, TrendingUp, BarChart3 } from "lucide-react";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../hooks/useAuth.jsx";
import { getTheme } from "../../../lib/theme.js";
import { usePayers } from "../../../hooks/usePayers.jsx";

const PayerList = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { payers, loading, error, refresh } = usePayers();

  const [activeFilters, setActiveFilters] = useState({});

  const transformedPayers = useMemo(() => {
    if (!payers || !Array.isArray(payers)) return [];
    return payers.map((payer) => ({
      ...payer,
      payerName: payer.payerInfo?.payerName || "N/A",
      payerType: payer.payerInfo?.payerType || "N/A",
      country: payer.addressInfo?.corporateHeadquarters?.country || "N/A",
      denialRate: payer.performanceMetrics?.denialRate || 0,
      isActive: payer.systemConfig?.isActive !== false,
    }));
  }, [payers]);

  const columns = [
    { key: "payerName", label: "Payer Name / ID", sortable: true, render: (v, row) => (
        <div>
          <div className="font-medium text-white flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400"/>{v}</div>
          <div className="text-sm text-gray-400 ml-6">{row.payerId}</div>
        </div>
      ) 
    },
    { key: "payerType", label: "Payer Type", sortable: true, render: (value) => <StatusBadge status={"trial"} label={value} /> },
    { key: "country", label: "Location", sortable: true, render: (v) => (
        <div className="flex items-center gap-2 text-sm text-gray-300"><Globe className="w-4 h-4 text-gray-500"/>{v}</div>
      )
    },
    { key: "denialRate", label: "Denial Rate", sortable: true, render: (v) => (
        <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`w-4 h-4 ${v > 10 ? 'text-red-400' : 'text-green-400'}`}/>
            <span className={v > 10 ? 'text-red-400' : 'text-gray-300'}>{v.toFixed(2)}%</span>
        </div>
      )
    },
    { key: "isActive", label: "Status", sortable: true, render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} /> },
  ];

  // CORRECTED: Filters are now generated dynamically from the fetched payers data
  const filters = useMemo(() => {
    if (!payers || payers.length === 0) {
        return [{ key: 'isActive', label: 'Status', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] }];
    }

    const payerTypes = [...new Set(payers.map(p => p.payerInfo?.payerType).filter(Boolean))];
    const payerTypeOptions = payerTypes.map(type => ({ value: type, label: type }));

    return [
      { key: 'payerType', label: 'Payer Type', options: payerTypeOptions },
      { key: 'isActive', label: 'Status', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] }
    ];
  }, [payers]);

  const handleFilterChange = (key, event) => {
    const value = event.target.value;
    const newFilters = { ...activeFilters };
    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
  };
 
  const filteredPayers = useMemo(() => {
    if (!transformedPayers) return [];
    if (Object.keys(activeFilters).length === 0) return transformedPayers;
    return transformedPayers.filter(payer => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (key === 'isActive') return String(payer.isActive) === value;
        return payer[key] === value;
      });
    });
  }, [transformedPayers, activeFilters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className={`w-8 h-8 text-${theme.accent}`} />
          <div>
            <h1 className={`text-3xl font-bold text-${theme.text}`}>Payer Directory</h1>
            <p className={`text-${theme.textSecondary} mt-1`}>Reference list of all insurance payers.</p>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredPayers} 
        columns={columns}
        rowKey="_id"
        title="Insurance Payers"
        subtitle="Search and filter through the list of approved payers."
        loading={loading}
        error={error}
        theme={userType}
        searchable={true}
        searchFields={['payerName', 'payerId']}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        paginated={true}
        itemsPerPage={15}
        itemsPerPageOptions={[10, 15, 25, 50]}
        onRefresh={refresh}
      />
    </div>
  );
};

export default PayerList;