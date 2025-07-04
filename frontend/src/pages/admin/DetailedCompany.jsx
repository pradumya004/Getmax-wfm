// frontend/src/pages/admin/DetailedCompany.jsx

// import React from "react";
// import { Building2, Mail, Phone, MapPin, User, Calendar, Globe, Briefcase, FileText, LayoutDashboard } from "lucide-react";

// export default function ViewCompanyDetail({ company }) {
//   if (!company) return null;

//   const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "N/A";

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white rounded-2xl border border-white/10 shadow-xl">
//       <div className="flex items-center space-x-4 mb-6">
//         <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
//           <Building2 className="w-8 h-8 text-white" />
//         </div>
//         <div>
//           <h2 className="text-3xl font-bold">{company.companyName}</h2>
//           <p className="text-white/70">ID: {company.companyId}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Contact & Billing Info */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-3">
//             <User className="w-4 h-4 text-white/60" />
//             <span>{company.contactPerson || "N/A"}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Mail className="w-4 h-4 text-white/60" />
//             <span>{company.contactEmail}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Phone className="w-4 h-4 text-white/60" />
//             <span>{company.contactPhone}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <MapPin className="w-4 h-4 text-white/60" />
//             <span>
//               {company.address?.street}, {company.address?.city}, {company.address?.state}, {company.address?.country} - {company.address?.zipCode}
//             </span>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex items-center space-x-3">
//             <Mail className="w-4 h-4 text-white/60" />
//             <span>Billing Email: {company.billingEmail}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <User className="w-4 h-4 text-white/60" />
//             <span>Billing Contact: {company.billingContactName}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Globe className="w-4 h-4 text-white/60" />
//             <span>{company.website || "No Website"}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Calendar className="w-4 h-4 text-white/60" />
//             <span>Created: {formatDate(company.createdAt)}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//         {/* Business Info */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-3">
//             <Briefcase className="w-4 h-4 text-white/60" />
//             <span>Subscription Plan: {company.subscriptionPlan}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <LayoutDashboard className="w-4 h-4 text-white/60" />
//             <span>Subscription Status: {company.subscriptionStatus}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Calendar className="w-4 h-4 text-white/60" />
//             <span>Start: {formatDate(company.subscriptionStartDate)} | End: {formatDate(company.subscriptionEndDate)}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Briefcase className="w-4 h-4 text-white/60" />
//             <span>Company Size: {company.companySize}</span>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Clock className="w-4 h-4 text-white/60" />
//             <span>Time Zone: {company.timeZone}</span>
//           </div>
//         </div>

//         {/* Contract Info */}
//         {company.contractSettings?.[0] && (
//           <div className="space-y-3">
//             <h3 className="text-white font-semibold text-lg mb-2">Contract Settings</h3>
//             <p><strong>Client Types:</strong> {company.contractSettings[0].clientType?.join(", ")}</p>
//             <p><strong>Contract Types:</strong> {company.contractSettings[0].contractType?.join(", ")}</p>
//             <p><strong>Specialties:</strong> {company.contractSettings[0].specialtyType?.join(", ")}</p>
//             <p><strong>Scope Format IDs:</strong> {company.contractSettings[0].scopeFormatID?.join(", ")}</p>
//           </div>
//         )}
//       </div>

//       <div className="mt-8 text-sm text-white/70 border-t border-white/20 pt-4">
//         <p>Status: <strong>{company.isActive ? "Active" : "Inactive"}</strong></p>
//         <p>Payment: <strong>{company.paymentStatus}</strong></p>
//         <p>API Enabled: <strong>{company.apiEnabled ? "Yes" : "No"}</strong></p>
//         <p>SFTP Enabled: <strong>{company.sftpEnabled ? "Yes" : "No"}</strong></p>
//       </div>
//     </div>
//   );
// }


import React from "react";
import {
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";

export default function DetailedCompany({ selectedCompany, onClose, formatDate, getPlanColor, getStatusColor }) {
  if (!selectedCompany) return null;

  const fullAddress = selectedCompany.address
    ? `${selectedCompany.address.street || ''}, ${selectedCompany.address.city || ''}, ${selectedCompany.address.state || ''}, ${selectedCompany.address.zipCode || ''}, ${selectedCompany.address.country || ''}`
    : "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedCompany.companyName}</h2>
              <p className="text-white/60">Company Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm">Company ID</p>
                <p className="text-white font-medium">{selectedCompany.companyId || selectedCompany._id}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Legal Name</p>
                <p className="text-white font-medium">{selectedCompany.companyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Plan</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(selectedCompany.subscriptionPlan)}`}>
                  {selectedCompany.subscriptionPlan}
                </span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedCompany.subscriptionStatus)}`}>
                  {selectedCompany.subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Contact Person</p>
                  <p className="text-white">{selectedCompany.contactPerson || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white">{selectedCompany.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Phone</p>
                  <p className="text-white">{selectedCompany.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Address</p>
                  <p className="text-white">
                    {selectedCompany.address
                        ? `${selectedCompany.address.street || ""}, ${selectedCompany.address.city || ""}, ${selectedCompany.address.state || ""}, ${selectedCompany.address.country || ""}`
                        : "N/A"}
                    </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Subscription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm">Start Date</p>
                <p className="text-white">{formatDate(selectedCompany.subscriptionStartDate)}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">End Date</p>
                <p className="text-white">{formatDate(selectedCompany.subscriptionEndDate)}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Payment Status</p>
                <p className="text-white">{selectedCompany.paymentStatus}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Time Zone</p>
                <p className="text-white">{selectedCompany.timeZone}</p>
              </div>
            </div>
          </div>

          {/* Contract Settings */}
          {selectedCompany.contractSettings?.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Contract Settings</h3>
              {selectedCompany.contractSettings.map((cs, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Client Type</p>
                    <p className="text-white">{cs.clientType?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Contract Type</p>
                    <p className="text-white">{cs.contractType?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Specialties</p>
                    <p className="text-white">{cs.specialtyType?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Scope Format</p>
                    <p className="text-white">{cs.scopeFormatID?.join(", ") || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
          >
            Close
          </button>
          <button className="px-6 py-3 bg-green-600/80 hover:bg-green-600 rounded-xl text-white transition-all duration-300 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Company</span>
          </button>
        </div>
      </div>
    </div>
  );
}

