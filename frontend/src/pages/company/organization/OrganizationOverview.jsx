// frontend/src/pages/company/organization/OrganizationOverview.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Building, Users, Shield, Briefcase, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import StatCard from "../../../components/common/StatCard.jsx";
import { organizationAPI } from "../../../api/organization.api.js";
import { useApi } from "../../../hooks/useApi.jsx";

const OrganizationOverview = () => {
  const navigate = useNavigate();
  const [orgData, setOrgData] = useState({
    departments: [],
    roles: [],
    designations: [],
    subdepartments: [],
  });

  const { loading, execute: fetchOrgData } = useApi(
    organizationAPI.getOrganizationalData
  );

  useEffect(() => {
    loadOrgData();
  }, []);

  const loadOrgData = async () => {
    const data = await fetchOrgData();
    if (data) setOrgData(data);
  };

  const managementCards = [
    {
      title: "Departments",
      description: "Manage organizational departments",
      count: orgData.departments.length,
      icon: Building,
      path: "/company/organization/departments",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Roles",
      description: "Define employee roles and permissions",
      count: orgData.roles.length,
      icon: Shield,
      path: "/company/organization/roles",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Designations",
      description: "Set up job designations and levels",
      count: orgData.designations.length,
      icon: Briefcase,
      path: "/company/organization/designations",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Sub-Departments",
      description: "Organize teams within departments",
      count: orgData.subdepartments.length,
      icon: Users,
      path: "/company/organization/subdepartments",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <Helmet>
        <title>Organization Management - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Organization Management
          </h1>
          <p className="text-blue-200">
            Configure your company's organizational structure
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {managementCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.count}
              icon={card.icon}
              theme="company"
            />
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.title}
                theme="company"
                className="p-6 group cursor-pointer"
                hoverable
              >
                <div onClick={() => navigate(card.path)}>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{card.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-400">
                      {card.count}
                    </span>
                    <Button
                      variant="secondary"
                      theme="company"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.path);
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card theme="company" className="p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              theme="company"
              variant="outline"
              onClick={() => navigate("/company/organization/roles")}
              className="flex flex-col items-center p-4 h-auto space-y-2"
            >
              <Shield className="w-6 h-6" />
              <span>Add Role</span>
            </Button>
            <Button
              theme="company"
              variant="outline"
              onClick={() => navigate("/company/organization/departments")}
              className="flex flex-col items-center p-4 h-auto space-y-2"
            >
              <Building className="w-6 h-6" />
              <span>Add Department</span>
            </Button>
            <Button
              theme="company"
              variant="outline"
              onClick={() => navigate("/company/organization/designations")}
              className="flex flex-col items-center p-4 h-auto space-y-2"
            >
              <Briefcase className="w-6 h-6" />
              <span>Add Designation</span>
            </Button>
            <Button
              theme="company"
              variant="outline"
              onClick={() => navigate("/company/employees")}
              className="flex flex-col items-center p-4 h-auto space-y-2"
            >
              <Users className="w-6 h-6" />
              <span>View Employees</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationOverview;
