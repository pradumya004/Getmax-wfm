import React from "react";
import {
  Building2, Users, Calendar, DollarSign, Eye, Edit, Trash2, MoreVertical
} from "lucide-react";

export default function ShowCompany({
  filteredCompanies,
  handleViewCompany,
  formatDate,
  getPlanColor,
  getStatusColor
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCompanies.map((company) => (
        <div
          key={company.id || company._id}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">{company.companyName || "Unnamed Company"}</h3>
                <p className="text-white/60 text-sm">{company.companyId || company._id || "No ID"}</p>
              </div>
            </div>
            <button className="text-white/60 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{company.companySize || 0} employees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">Joined {formatDate(company.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{company.revenue || "$0"}/month</span>
            </div>
          </div>

          {/* Status & Plan */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(company.subscriptionPlan)}`}>
              {company.subscriptionPlan || "Basic"}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(company.subscriptionStatus)}`}>
              {company.subscriptionStatus || "Active"}
            </span>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-4 mb-4">
            <p className="text-white font-medium text-sm">Contact Name: {company.contactPerson || "No contact person"}</p>
            <p className="text-white/60 text-sm">Contact Email: {company.contactEmail || "No email"}</p>
            <p className="text-white/60 text-sm">Company Contact: {company.contactPhone || "No phone"}</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button onClick={() => handleViewCompany(company)} className="flex-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white text-sm font-medium flex items-center justify-center space-x-2">
              <Eye className="w-4 h-4" /><span>View</span>
            </button>
            <button className="flex-1 px-3 py-2 bg-green-600/80 hover:bg-green-600 rounded-lg text-white text-sm font-medium flex items-center justify-center space-x-2">
              <Edit className="w-4 h-4" /><span>Edit</span>
            </button>
            <button className="px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white text-sm font-medium flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
