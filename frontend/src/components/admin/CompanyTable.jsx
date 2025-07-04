// frontend/src/components/admin/CompanyTable.jsx

import React, { useState } from "react";
import {
  Building,
  Users,
  Calendar,
  MoreVertical,
  Eye,
  Settings,
  Ban,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/Table.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Dropdown, DropdownItem, DropdownSeparator } from "../ui/Dropdown.jsx";
import { formatDate, formatCurrency } from "../../lib/utils.js";

export const CompanyTable = ({
  companies = [],
  onView,
  onSuspend,
  onChangePlan,
  loading = false,
}) => {
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    if (!sortField) return 0;

    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getPlanColor = (plan) => {
    const colors = {
      Basic: "bg-green-500/20 text-green-400 border-green-500/30",
      Professional: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[plan] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableHead
          sortable
          onSort={() => handleSort("companyName")}
          sortDirection={sortField === "companyName" ? sortDirection : null}
        >
          Company
        </TableHead>
        <TableHead
          sortable
          onSort={() => handleSort("totalEmployees")}
          sortDirection={sortField === "totalEmployees" ? sortDirection : null}
        >
          Employees
        </TableHead>
        <TableHead>Plan</TableHead>
        <TableHead>Status</TableHead>
        <TableHead
          sortable
          onSort={() => handleSort("createdAt")}
          sortDirection={sortField === "createdAt" ? sortDirection : null}
        >
          Joined
        </TableHead>
        <TableHead>Revenue</TableHead>
        <TableHead>Actions</TableHead>
      </TableHeader>
      <TableBody>
        {sortedCompanies.map((company) => (
          <TableRow key={company.companyId}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">
                    {company.companyName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {company.companyId}
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white">
                  {company.totalEmployees || 0}
                </span>
              </div>
            </TableCell>

            <TableCell>
              <Badge className={getPlanColor(company.subscriptionPlan)}>
                {company.subscriptionPlan}
              </Badge>
            </TableCell>

            <TableCell>
              <Badge status={company.isActive ? "active" : "suspended"}>
                {company.isActive ? "Active" : "Suspended"}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">
                  {formatDate(company.createdAt, "short")}
                </span>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-green-400 font-medium">
                {formatCurrency(company.monthlyRevenue || 0)}
              </span>
            </TableCell>

            <TableCell>
              <Dropdown
                trigger={
                  <Button variant="ghost" className="p-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                }
                align="right"
              >
                <DropdownItem onClick={() => onView?.(company)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownItem>
                <DropdownItem onClick={() => onChangePlan?.(company)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Change Plan
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  onClick={() => onSuspend?.(company)}
                  className="text-red-400"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {company.isActive ? "Suspend" : "Activate"}
                </DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};