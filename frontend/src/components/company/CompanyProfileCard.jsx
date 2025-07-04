// frontend/src/components/company/CompanyProfileCard.jsx

import React from "react";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Crown,
} from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { formatDate } from "../../lib/utils.js";

export const CompanyProfileCard = ({ company, onEdit }) => {
  console.log("CompanyProfileCard - company:", company);

  return (
    <Card theme="company" className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {company.companyName}
            </h2>
            <p className="text-blue-400">{company.companyId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge status="active">Active</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Crown className="w-3 h-3 mr-1" />
            {company.subscriptionPlan}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {company.contactEmail && (
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Contact Email</p>
                <p className="text-white">{company.contactEmail}</p>
              </div>
            </div>
          )}

          {company.contactPhone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Contact Phone</p>
                <p className="text-white">{company.contactPhone}</p>
              </div>
            </div>
          )}

          {company.address && typeof company.address === "object" && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white">
                  {[
                    company.address?.street,
                    company.address?.city,
                    company.address?.state,
                    company.address?.zipCode,
                    company.address?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Company Founded</p>
              <p className="text-white">
                {/* {formatDate(company.createdAt, "short")} */}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Employees</p>
              <p className="text-white">{company.totalEmployees || 0}</p>
            </div>
          </div>

          {company.website && (
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-gray-400 text-sm">Website</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {company.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
