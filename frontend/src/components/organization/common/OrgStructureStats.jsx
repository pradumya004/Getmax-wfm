// frontend/src/components/organization/common/OrgStructureStats.jsx

import React from "react";
import { Building, Shield, Briefcase, Users } from "lucide-react";
import {StatCard} from "../../common/StatCard.jsx";

export const OrgStructureStats = ({
  orgData,
  employees = [],
  theme = "company",
}) => {
  const stats = [
    {
      title: "Departments",
      value: orgData.departments?.length || 0,
      icon: Building,
      color: "text-green-400",
    },
    {
      title: "Roles",
      value: orgData.roles?.length || 0,
      icon: Shield,
      color: "text-blue-400",
    },
    {
      title: "Designations",
      value: orgData.designations?.length || 0,
      icon: Briefcase,
      color: "text-purple-400",
    },
    {
      title: "Sub-Departments",
      value: orgData.subdepartments?.length || 0,
      icon: Users,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          theme={theme}
        />
      ))}
    </div>
  );
};
