import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Upload, Eye, Trash2, Edit, DollarSign, FileClock, Hourglass } from "lucide-react";

import { useClaims } from "../../hooks/useClaims";
import { useClients } from "../../hooks/useClient";
import { useSOWs } from "../../hooks/useSows";

import { Button } from "../../components/ui/Button.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { StatCard } from "../../components/common/StatCard.jsx";
import { StatusBadge } from "../../components/common/StatusBadge.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate, formatCurrency } from "../../lib/utils.js";

const ClaimList = () => {
    const navigate = useNavigate();
    const { userType } = useAuth();
    const theme = getTheme(userType);

    const { claims, loading, error, loadClaims } = useClaims();
    const { clients, loadClients } = useClients();
    const { sowList, getClientSOWs } = useSOWs();

    const [activeFilters, setActiveFilters] = useState({
        status: "all",
        clientRef: "all",
        sowRef: "all",
    });

    useEffect(() => {
        loadClaims();
        loadClients();
    }, []);

    useEffect(() => {
        if (activeFilters.clientRef && activeFilters.clientRef !== 'all') {
            getClientSOWs(activeFilters.clientRef);
        }
    }, [activeFilters.clientRef]);

    // Log fetched claims to the console
    useEffect(() => {
        if (claims && claims.length > 0) {
            console.log("Fetched Claims:", claims);
        }
    }, [claims]);

    const handleFilterChange = (filterKey, value) => {
        const newFilters = { ...activeFilters, [filterKey]: value };

        if (filterKey === 'clientRef') {
            newFilters.sowRef = 'all'; // Reset SOW when client changes
        }

        setActiveFilters(newFilters);
    };

    // Data Transformation
    const transformedClaims = useMemo(() => {
        if (!claims || !Array.isArray(claims)) return [];
        return claims.map(claim => ({
            ...claim,
            claimId: claim.claimId || "N/A",
            patientName: `${claim.patientRef?.personalInfo?.firstName || ''} ${claim.patientRef?.personalInfo?.lastName || 'N/A'}`.trim(),
            clientName: claim.clientRef?.clientInfo?.clientName || "N/A",
            dateOfService: claim.claimInfo?.dateOfService,
            outstandingBalance: claim.financialInfo?.outstandingBalance || 0,
            status: claim.workflowStatus?.currentStatus || "Unknown",
        }));
    }, [claims]);

    // Apply filters to transformed data
    const filteredClaims = useMemo(() => {
        return transformedClaims.filter((claim) => {
            if (activeFilters.status !== "all" && claim.status !== activeFilters.status) {
                return false;
            }
            if (activeFilters.clientRef !== "all" && claim.clientRef?._id !== activeFilters.clientRef) {
                return false;
            }
            if (activeFilters.sowRef !== "all" && claim.sowRef?._id !== activeFilters.sowRef) {
                return false;
            }
            return true;
        });
    }, [transformedClaims, activeFilters]);

    // ✅ FIX 1: Update column definitions to match DataTable.jsx API
    const columns = useMemo(() => [
        {
            key: "claimId",
            label: "Claim ID",
            sortable: true,
            render: (value, claim) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/company/claims/${claim._id}`)
                    }}
                    className="font-medium text-emerald-400 hover:text-emerald-300"
                >
                    {value}
                </button>
            ),
        },
        {
            key: "patientName",
            label: "Patient",
            sortable: true,
        },
        {
            key: "clientName",
            label: "Client",
            sortable: true,
        },
        {
            key: "dateOfService",
            label: "Date of Service",
            sortable: true,
            render: (value) => value ? formatDate(value) : 'N/A',
        },
        {
            key: "outstandingBalance",
            label: "Balance",
            sortable: true,
            render: (value) => <span className="font-semibold text-yellow-400">{formatCurrency(value)}</span>,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => <StatusBadge status={value} variant="claim" />,
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (value, claim) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost" size="sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/company/claims/${claim._id}`) }}
                        title="View Claim" className="p-2 hover:bg-blue-500/20"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate]);

    // Action buttons for DataTable
    const actions = [
        {
            label: "Create Claim",
            icon: PlusCircle,
            onClick: () => navigate("/company/claims/create"),
            variant: "primary",
        },
        {
            label: "Bulk Upload",
            icon: Upload,
            onClick: () => navigate("/company/claims/bulk"),
            variant: "outline",
        }
    ];

    // Filter definitions for DataTable
    const filters = [
        {
            key: "status",
            label: "Status",
            options: ['New', 'Assigned', 'In Progress', 'Pending Info', 'On Hold', 'Pending Payment', 'Appealed', 'Denied', 'Completed', 'QA Review', 'QA Failed', 'Closed'].map(s => ({ value: s, label: s })),
        },
        {
            key: "clientRef",
            label: "Client",
            options: (clients || []).map(c => ({ value: c._id, label: c.clientInfo.clientName })),
        },
        {
            key: "sowRef",
            label: "SOW",
            options: (sowList || []).map(s => ({ value: s._id, label: s.sowName })),
            disabled: !activeFilters.clientRef || activeFilters.clientRef === 'all',
        }
    ];

    //Define search fields for DataTable
    const searchFields = ["claimId", "patientName", "clientName"];

    const handleRowClick = (claim) => {
        navigate(`/company/claims/${claim._id}`);
    };

    const claimStats = useMemo(() => {
        if (!claims || claims.length === 0) {
            return { totalClaims: 0, openClaims: 0, totalOutstanding: 0, claimsPastDue: 0 };
        }
        const today = new Date();
        const openStatus = ['New', 'Assigned', 'In Progress', 'Pending Info', 'On Hold', 'Appealed'];

        let totalOutstanding = 0;
        let openClaims = 0;
        let claimsPastDue = 0;

        claims.forEach(claim => {
            totalOutstanding += claim.financialInfo?.outstandingBalance || 0;
            if (openStatus.includes(claim.workflowStatus?.currentStatus)) {
                openClaims++;
            }
            const dos = new Date(claim.claimInfo?.dateOfService);
            const agingDays = Math.floor((today - dos) / (1000 * 60 * 60 * 24));
            if (agingDays > 90) { // Assuming 90 days is past due
                claimsPastDue++;
            }
        });

        return {
            totalClaims: claims.length,
            openClaims,
            totalOutstanding,
            claimsPastDue
        };
    }, [claims]);

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <Helmet><title>Claim Management - GetMax</title></Helmet>

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Claim Management</h1>
                <p className="text-gray-400 mt-1">Monitor and manage all billing claims.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Outstanding"
                    value={claimStats.totalOutstanding}
                    // ✅ FIX: Changed prop name from "format" to "type"
                    type="currency"
                    icon={DollarSign}
                    theme={userType}
                />
                <StatCard
                    title="Open Claims"
                    value={claimStats.openClaims}
                    type="number" // Type is "number" by default, but being explicit is good
                    icon={FileClock}
                    theme={userType}
                />
                <StatCard
                    title="Claims Past Due (>90d)"
                    value={claimStats.claimsPastDue}
                    type="number"
                    icon={Hourglass}
                    theme={userType}
                />
                <StatCard
                    title="Total Claims"
                    value={claimStats.totalClaims}
                    type="number"
                    icon={PlusCircle}
                    theme={userType}
                />
            </div>


            <DataTable
                // Data props
                data={filteredClaims}
                columns={columns}
                loading={loading}
                error={error}

                // Display props
                title="Claim Management"
                subtitle="View, search, and manage all claims across your clients."
                theme={theme}

                // Functionality props
                searchable={true}
                searchFields={searchFields} // Pass the defined search fields
                searchPlaceholder="Search by Claim ID, Patient, or Client..."

                // Actions props
                actions={actions}
                onRowClick={handleRowClick}
                onRefresh={loadClaims}

                // Filter props
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}

                // Explicitly set the row key
                rowKey="_id"

                // Other props
                paginated={true}
                itemsPerPage={15}
                stickyHeader={true}
                responsive={true}
                emptyStateTitle="No Claims Found"
                emptyStateDescription="There are no claims matching your criteria. Try adjusting the filters or creating a new claim."
            />
        </div>
    );
};

export default ClaimList;