// frontend/src/pages/admin/PlatformStats.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Building, Users, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "../../components/common/StatCard.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { adminAPI } from "../../api/admin.api.js";
import { useApi } from "../../hooks/useApi.jsx";

const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalEmployees: 0,
    activeEmployees: 0,
  });

  const { loading, execute: fetchStats } = useApi(adminAPI.getPlatformStats);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await fetchStats();
    if (data) setStats(data);
  };

  const companyGrowth =
    stats.totalCompanies > 0
      ? ((stats.activeCompanies / stats.totalCompanies) * 100).toFixed(1)
      : 0;

  const employeeGrowth =
    stats.totalEmployees > 0
      ? ((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <Helmet>
        <title>Platform Statistics - Admin Dashboard</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Platform Statistics
          </h1>
          <p className="text-red-200">
            Overview of platform performance and metrics
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            icon={Building}
            theme="admin"
          />
          <StatCard
            title="Active Companies"
            value={stats.activeCompanies}
            change={companyGrowth}
            icon={TrendingUp}
            theme="admin"
          />
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            theme="admin"
          />
          <StatCard
            title="Active Employees"
            value={stats.activeEmployees}
            change={employeeGrowth}
            icon={Users}
            theme="admin"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card theme="admin" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Company Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Companies</span>
                <span className="text-white font-medium">
                  {stats.totalCompanies}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Companies</span>
                <span className="text-green-400 font-medium">
                  {stats.activeCompanies}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Suspended Companies</span>
                <span className="text-red-400 font-medium">
                  {stats.totalCompanies - stats.activeCompanies}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Activation Rate</span>
                <span className="text-blue-400 font-medium">
                  {companyGrowth}%
                </span>
              </div>
            </div>
          </Card>

          <Card theme="admin" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Employee Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Employees</span>
                <span className="text-white font-medium">
                  {stats.totalEmployees}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Employees</span>
                <span className="text-green-400 font-medium">
                  {stats.activeEmployees}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Inactive Employees</span>
                <span className="text-red-400 font-medium">
                  {stats.totalEmployees - stats.activeEmployees}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Activity Rate</span>
                <span className="text-blue-400 font-medium">
                  {employeeGrowth}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
