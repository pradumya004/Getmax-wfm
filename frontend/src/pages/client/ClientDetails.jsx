// frontend/src/pages/client/ClientDetails.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  DollarSign,
  Calendar,
  Clock,
  Zap,
  Shield,
  FileText,
  Settings,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Star,
  Flag,
  Archive,
  Send,
  Plus,
  Link,
  Globe,
  Server,
  Database,
  Key,
  Lock,
  Unlock,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { ConfirmDialog } from "../../components/common/ConfirmDialog.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { ClientFinancialInfo } from "../../components/client/ClientFinancialInfo.jsx";
import { ClientIntegrationCard } from "../../components/client/ClientIntegrationCard.jsx";
import { ClientOnboardingProgress } from "../../components/client/ClientOnboardingProcess.jsx";
import { ClientStatusBadge } from "../../components/client/ClientStatusBadge.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate, formatCurrency } from "../../lib/utils.js";
import { toast } from "react-hot-toast";

const ClientDetails = () => {
  const { clientId } = useParams();
  console.log("Client ID from route:", clientId);
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const {
    getClientById,
    removeClient,
    updateIntegrationConfig,
    updateSyncStatus,
  } = useClients();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      const clientData = await getClientById(clientId);
      setClient(clientData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load client details");
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    try {
      await removeClient(clientId);
      toast.success("Client deleted successfully");
      navigate("/employee/clients/list");
    } catch (error) {
      toast.error("Failed to delete client");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await updateSyncStatus(clientId, { lastSyncDate: new Date() });
      toast.success("Data synchronized successfully");
      await loadClientDetails();
    } catch (error) {
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  console.log("Client details:", client);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          Error Loading Client
        </h3>
        <p className={`text-${theme.textSecondary} mb-4`}>
          {error || "Client not found"}
        </p>
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/employee/clients/list")}
          >
            Back to Clients
          </Button>
          <Button onClick={loadClientDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>{client.clientInfo?.clientName} - Client Details - GetMax</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/employee/clients/list")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Clients</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {client.clientInfo?.clientName}
              </h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                {client.clientInfo?.clientType} •{" "}
                {client.clientInfo?.clientSubType}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={handleSyncData}
              loading={isSyncing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/employee/clients/edit/${clientId}`)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Client Header Card */}
        <Card className={`${theme.card} p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${theme.secondary} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  {client.clientInfo?.clientName}
                </h2>
                <p className={`text-${theme.textSecondary} text-sm mb-2`}>
                  {client.clientInfo?.legalName &&
                  client.clientInfo.legalName !== client.clientInfo.clientName
                    ? `Legal: ${client.clientInfo.legalName}`
                    : "Legal name same as client name"}
                </p>
                <div className="flex items-center space-x-3">
                  <ClientStatusBadge status={client.status?.clientStatus} />
                  <Badge
                    variant={
                      client.status?.riskLevel === "Low" ? "success" : "warning"
                    }
                  >
                    {client.status?.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline">
                    Created {formatDate(client.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {client.status?.onboardingProgress || 0}%
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Onboarding
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {client.integrationStrategy?.apiConfig?.isConfigured
                      ? "Yes"
                      : "No"}
                  </div>
                  <div className={`text-${theme.textSecondary} text-sm`}>
                    Connected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Key Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className={`${theme.card} p-6`}>
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Client Type
                      </label>
                      <div className="text-white font-medium">
                        {client.clientInfo?.clientType}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Sub Type
                      </label>
                      <div className="text-white font-medium">
                        {client.clientInfo?.clientSubType || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Tax ID
                      </label>
                      <div className="text-white font-medium">
                        {client.clientInfo?.taxId || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        NPI Number
                      </label>
                      <div className="text-white font-medium">
                        {client.clientInfo?.npiNumber || "Not provided"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Description
                      </label>
                      <div className="text-white font-medium">
                        {client.clientInfo?.description ||
                          "No description provided"}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Address Information */}
                <Card className={`${theme.card} p-6`}>
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        Business Address
                      </h4>
                      <div className="space-y-2">
                        <div className="text-white">
                          {client.addressInfo?.businessAddress?.street}
                        </div>
                        <div className="text-white">
                          {client.addressInfo?.businessAddress?.city},{" "}
                          {client.addressInfo?.businessAddress?.state}{" "}
                          {client.addressInfo?.businessAddress?.zipCode}
                        </div>
                        <div className="text-white">
                          {client.addressInfo?.businessAddress?.country}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Billing Address
                      </h4>
                      <div className="space-y-2">
                        {client.addressInfo?.billingAddress
                          ?.sameAsBusinessAddress ? (
                          <div className={`text-${theme.textSecondary} italic`}>
                            Same as business address
                          </div>
                        ) : (
                          <>
                            <div className="text-white">
                              {client.addressInfo?.billingAddress?.street}
                            </div>
                            <div className="text-white">
                              {client.addressInfo?.billingAddress?.city},{" "}
                              {client.addressInfo?.billingAddress?.state}{" "}
                              {client.addressInfo?.billingAddress?.zipCode}
                            </div>
                            <div className="text-white">
                              {client.addressInfo?.billingAddress?.country}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Service Configuration */}
                <Card className={`${theme.card} p-6`}>
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Service Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Service Type
                      </label>
                      <div className="text-white font-medium">
                        {client.serviceConfig?.serviceType || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Expected Volume
                      </label>
                      <div className="text-white font-medium">
                        {client.serviceConfig?.expectedVolume ||
                          "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Start Date
                      </label>
                      <div className="text-white font-medium">
                        {client.serviceConfig?.startDate
                          ? formatDate(client.serviceConfig.startDate)
                          : "Not set"}
                      </div>
                    </div>
                    <div>
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Compliance
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {client.serviceConfig?.complianceRequirements?.map(
                          (req) => (
                            <Badge key={req} variant="outline" size="sm">
                              {req}
                            </Badge>
                          )
                        ) || (
                          <span
                            className={`text-${theme.textSecondary} text-sm`}
                          >
                            None specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {client.serviceConfig?.specialRequirements && (
                    <div className="mt-4">
                      <label className={`text-${theme.textSecondary} text-sm`}>
                        Special Requirements
                      </label>
                      <div className="text-white font-medium mt-1">
                        {client.serviceConfig.specialRequirements}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Column - Status Cards */}
              <div className="space-y-6">
                <ClientOnboardingProgress client={client} />
                <ClientIntegrationCard client={client} />
                <ClientFinancialInfo client={client} />

                {/* Quick Actions */}
                <Card className={`${theme.card} p-6`}>
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowIntegrationModal(true)}
                    >
                      <Zap className="w-4 h-4 mr-3" />
                      Setup Integration
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowCredentialsModal(true)}
                    >
                      <Key className="w-4 h-4 mr-3" />
                      View Credentials
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        navigate(`/employee/clients/onboarding/${clientId}`)
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-3" />
                      Onboarding Workflow
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-3" />
                      Generate Report
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Contact */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Primary Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Name
                    </label>
                    <div className="text-white font-medium">
                      {client.contactInfo?.primaryContact?.name ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Title
                    </label>
                    <div className="text-white font-medium">
                      {client.contactInfo?.primaryContact?.title ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.primaryContact?.email ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.primaryContact?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.primaryContact.email
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Phone
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.primaryContact?.phone ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.primaryContact?.phone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.primaryContact.phone
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {client.contactInfo?.primaryContact?.email && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          `mailto:${client.contactInfo.primaryContact.email}`,
                          "_blank"
                        )
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                )}
              </Card>

              {/* Billing Contact */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Billing Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Name
                    </label>
                    <div className="text-white font-medium">
                      {client.contactInfo?.billingContact?.name ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.billingContact?.email ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.billingContact?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.billingContact.email
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Phone
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.billingContact?.phone ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.billingContact?.phone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.billingContact.phone
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Technical Contact */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Technical Contact
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Name
                    </label>
                    <div className="text-white font-medium">
                      {client.contactInfo?.technicalContact?.name ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.technicalContact?.email ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.technicalContact?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.technicalContact.email
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Phone
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-medium">
                        {client.contactInfo?.technicalContact?.phone ||
                          "Not provided"}
                      </div>
                      {client.contactInfo?.technicalContact?.phone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              client.contactInfo.technicalContact.phone
                            )
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Integration Status */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Integration Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-${theme.textSecondary}`}>
                      Connection Status
                    </span>
                    <Badge
                      className={
                        client.integrationStrategy?.apiConfig?.isConfigured
                          ? "bg-green-500/20 text-green-300 border-green-400/30"
                          : "bg-red-500/20 text-red-300 border-red-400/30"
                      }
                    >
                      {client.integrationStrategy?.apiConfig?.isConfigured
                        ? "Connected"
                        : "Not Connected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-${theme.textSecondary}`}>
                      Workflow Type
                    </span>
                    <span className="text-white">
                      {client.integrationStrategy?.workflowType || "Not Set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-${theme.textSecondary}`}>
                      Last Sync
                    </span>
                    <span className="text-white">
                      {client.integrationStrategy?.apiConfig?.lastSyncDate
                        ? formatDate(
                            client.integrationStrategy.apiConfig.lastSyncDate
                          )
                        : "Never"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* EHR System */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  EHR/PM System
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      System Name
                    </label>
                    <div className="text-white font-medium">
                      {client.integrationStrategy?.ehrPmSystem?.systemName ||
                        "Not specified"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Version
                    </label>
                    <div className="text-white font-medium">
                      {client.integrationStrategy?.ehrPmSystem?.systemVersion ||
                        "Not specified"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Vendor Contact
                    </label>
                    <div className="text-white font-medium">
                      {client.integrationStrategy?.ehrPmSystem?.vendorContact
                        ?.name || "Not specified"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* API Configuration */}
              <Card className={`${theme.card} p-6 lg:col-span-2`}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  API Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      API Access Required
                    </label>
                    <div className="text-white font-medium">
                      {client.integrationStrategy?.apiConfig?.requiresApiAccess
                        ? "Yes"
                        : "No"}
                    </div>
                  </div>

                  {client.integrationStrategy?.apiConfig?.requiresApiAccess && (
                    <>
                      <div>
                        <label
                          className={`text-${theme.textSecondary} text-sm`}
                        >
                          API Endpoint
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="text-white font-medium text-sm break-all">
                            {client.integrationStrategy?.apiConfig
                              ?.apiEndpoint || "Not configured"}
                          </div>
                          {client.integrationStrategy?.apiConfig
                            ?.apiEndpoint && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  client.integrationStrategy.apiConfig
                                    .apiEndpoint
                                )
                              }
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          className={`text-${theme.textSecondary} text-sm`}
                        >
                          Authentication Method
                        </label>
                        <div className="text-white font-medium">
                          {client.integrationStrategy?.apiConfig?.authMethod ||
                            "Not configured"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Billing Information */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Billing Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Currency
                    </label>
                    <div className="text-white font-medium">
                      {client.financialInfo?.billingCurrency || "USD"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Payment Terms
                    </label>
                    <div className="text-white font-medium">
                      {client.financialInfo?.paymentTerms || "Net 30"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Credit Limit
                    </label>
                    <div className="text-white font-medium">
                      {client.financialInfo?.creditLimit
                        ? formatCurrency(
                            client.financialInfo.creditLimit,
                            client.financialInfo.billingCurrency
                          )
                        : "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Billing Frequency
                    </label>
                    <div className="text-white font-medium">
                      {client.financialInfo?.billingFrequency || "Monthly"}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Status */}
              <Card className={`${theme.card} p-6`}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-${theme.textSecondary}`}>
                      Account Status
                    </span>
                    <Badge
                      className={
                        client.financialInfo?.accountStatus === "Good Standing"
                          ? "bg-green-500/20 text-green-300 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                      }
                    >
                      {client.financialInfo?.accountStatus || "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-${theme.textSecondary}`}>
                      Invoice Format
                    </span>
                    <span className="text-white">
                      {client.financialInfo?.invoiceFormat || "PDF"}
                    </span>
                  </div>
                </div>

                {client.financialInfo?.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <label className={`text-${theme.textSecondary} text-sm`}>
                      Special Instructions
                    </label>
                    <div className="text-white font-medium mt-1">
                      {client.financialInfo.specialInstructions}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className={`${theme.card} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Documents</h3>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Upload Document</span>
                </Button>
              </div>

              <div className="text-center py-12">
                <FileText
                  className={`w-16 h-16 text-${theme.textSecondary} mx-auto mb-4`}
                />
                <h4 className="text-white font-medium mb-2">
                  No documents uploaded
                </h4>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Upload contracts, agreements, or other relevant documents
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className={`${theme.card} p-6`}>
              <h3 className="text-white text-lg font-semibold mb-4">
                Recent Activity
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 bg-${theme.accent}/20 rounded-full flex items-center justify-center`}
                  >
                    <Plus className={`w-4 h-4 text-${theme.accent}`} />
                  </div>
                  <div>
                    <div className="text-white font-medium">Client created</div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      {formatDate(client.createdAt)}
                    </div>
                  </div>
                </div>

                {client.auditInfo?.lastModifiedAt && (
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 bg-${theme.accent}/20 rounded-full flex items-center justify-center`}
                    >
                      <Edit className={`w-4 h-4 text-${theme.accent}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Client information updated
                      </div>
                      <div className={`text-${theme.textSecondary} text-sm`}>
                        {formatDate(client.auditInfo.lastModifiedAt)}
                      </div>
                    </div>
                  </div>
                )}

                {client.status?.lastActivityDate && (
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 bg-${theme.accent}/20 rounded-full flex items-center justify-center`}
                    >
                      <Activity className={`w-4 h-4 text-${theme.accent}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Last activity
                      </div>
                      <div className={`text-${theme.textSecondary} text-sm`}>
                        {formatDate(client.status.lastActivityDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete "${client.clientInfo?.clientName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default ClientDetails;
