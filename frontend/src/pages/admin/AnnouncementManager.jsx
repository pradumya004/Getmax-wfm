import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Calendar,
  Clock,
  Users,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  RefreshCw,
  Search,
  Filter,
  Download,
  Bell,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Image,
  Link,
  Settings,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useMasterAdmin } from "../../hooks/useMasterAdmin.jsx";
import { getTheme } from "../../lib/theme.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";

const AnnouncementManager = () => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);

  const { companies, loadCompanies } = useMasterAdmin();

  const [announcements, setAnnouncements] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    target: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    targetType: "all",
    targetCompanies: [],
    scheduledAt: "",
    expiresAt: "",
    actionUrl: "",
    actionText: "",
    isActive: true,
  });

  useEffect(() => {
    loadAnnouncementData();
  }, []);

  const loadAnnouncementData = async () => {
    try {
      await loadCompanies();
      // Mock announcements data
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error("Failed to load announcement data:", error);
      toast.error("Failed to load announcement data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnnouncementData();
    setRefreshing(false);
    toast.success("Announcements refreshed!");
  };

  const handleCreateAnnouncement = async () => {
    try {
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: formData.scheduledAt ? "scheduled" : "active",
        views: 0,
        clicks: 0,
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setShowCreateModal(false);
      resetForm();
      toast.success("Announcement created successfully!");
    } catch (error) {
      console.error("Failed to create announcement:", error);
      toast.error("Failed to create announcement");
    }
  };

  const handleUpdateAnnouncement = async () => {
    try {
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.id === selectedAnnouncement.id
            ? { ...ann, ...formData, updatedAt: new Date() }
            : ann
        )
      );
      setShowEditModal(false);
      setSelectedAnnouncement(null);
      resetForm();
      toast.success("Announcement updated successfully!");
    } catch (error) {
      console.error("Failed to update announcement:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
      toast.success("Announcement deleted successfully!");
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.id === id ? { ...ann, isActive: !ann.isActive } : ann
        )
      );
      toast.success("Announcement status updated!");
    } catch (error) {
      console.error("Failed to update announcement status:", error);
      toast.error("Failed to update announcement status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      targetType: "all",
      targetCompanies: [],
      scheduledAt: "",
      expiresAt: "",
      actionUrl: "",
      actionText: "",
      isActive: true,
    });
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetType: announcement.targetType,
      targetCompanies: announcement.targetCompanies || [],
      scheduledAt: announcement.scheduledAt || "",
      expiresAt: announcement.expiresAt || "",
      actionUrl: announcement.actionUrl || "",
      actionText: announcement.actionText || "",
      isActive: announcement.isActive,
    });
    setShowEditModal(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-green-400 bg-green-400/20 border-green-400/30",
      medium: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
      high: "text-red-400 bg-red-400/20 border-red-400/30",
      urgent: "text-purple-400 bg-purple-400/20 border-purple-400/30",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-400 bg-green-400/20 border-green-400/30",
      scheduled: "text-blue-400 bg-blue-400/20 border-blue-400/30",
      expired: "text-gray-400 bg-gray-400/20 border-gray-400/30",
      draft: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
    };
    return colors[status] || colors.draft;
  };

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: 1,
      title: "Platform Maintenance Scheduled",
      content:
        "We will be performing scheduled maintenance on our platform this weekend. Please expect some downtime between 2-4 AM EST.",
      priority: "high",
      targetType: "all",
      targetCompanies: [],
      status: "active",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      scheduledAt: null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      actionUrl: "/maintenance",
      actionText: "Learn More",
      isActive: true,
      views: 1247,
      clicks: 89,
    },
    {
      id: 2,
      title: "New Feature: Enhanced Reporting",
      content:
        "We're excited to announce our new enhanced reporting features that provide deeper insights into your workforce data.",
      priority: "medium",
      targetType: "companies",
      targetCompanies: ["comp1", "comp2"],
      status: "active",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      scheduledAt: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      actionUrl: "/features/reporting",
      actionText: "Explore Features",
      isActive: true,
      views: 892,
      clicks: 234,
    },
    {
      id: 3,
      title: "Security Update Required",
      content:
        "Please update your passwords and enable two-factor authentication for enhanced security.",
      priority: "urgent",
      targetType: "all",
      targetCompanies: [],
      status: "scheduled",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      actionUrl: "/security",
      actionText: "Update Settings",
      isActive: true,
      views: 0,
      clicks: 0,
    },
  ];

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    if (
      filters.search &&
      !announcement.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status && announcement.status !== filters.status) {
      return false;
    }
    if (filters.priority && announcement.priority !== filters.priority) {
      return false;
    }
    if (filters.target && announcement.targetType !== filters.target) {
      return false;
    }
    return true;
  });

  const announcementStats = {
    total: mockAnnouncements.length,
    active: mockAnnouncements.filter((a) => a.status === "active").length,
    scheduled: mockAnnouncements.filter((a) => a.status === "scheduled").length,
    totalViews: mockAnnouncements.reduce((sum, a) => sum + a.views, 0),
    totalClicks: mockAnnouncements.reduce((sum, a) => sum + a.clicks, 0),
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.primary} text-${theme.text}`}
    >
      <Helmet>
        <title>Announcement Manager | Master Admin</title>
      </Helmet>

      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${theme.glass} backdrop-blur-xl border-b border-${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent`}
              >
                Announcement Manager
              </h1>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Create and manage platform-wide announcements
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                theme={userType}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant="primary"
                size="sm"
                theme={userType}
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Total</p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {announcementStats.total}
                </p>
              </div>
              <Megaphone className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>Active</p>
                <p className={`text-2xl font-bold text-green-400`}>
                  {announcementStats.active}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Scheduled
                </p>
                <p className={`text-2xl font-bold text-blue-400`}>
                  {announcementStats.scheduled}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Views
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {announcementStats.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </Card>

          <Card theme={userType} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.textSecondary} text-sm`}>
                  Total Clicks
                </p>
                <p className={`text-2xl font-bold text-${theme.text}`}>
                  {announcementStats.totalClicks.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card theme={userType} className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${theme.textSecondary}`}
                />
                <Input
                  placeholder="Search announcements..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  theme={userType}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </Select>

              <Select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>

              <Select
                value={filters.target}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, target: e.target.value }))
                }
                theme={userType}
                className="min-w-[120px]"
              >
                <option value="">All Targets</option>
                <option value="all">All Companies</option>
                <option value="companies">Specific Companies</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} theme={userType} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className={`text-lg font-semibold text-${theme.text}`}>
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        announcement.status
                      )}`}
                    >
                      {announcement.status.toUpperCase()}
                    </span>
                  </div>

                  <p className={`text-${theme.textSecondary} mb-4`}>
                    {announcement.content}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Target
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {announcement.targetType === "all"
                          ? "All Companies"
                          : `${
                              announcement.targetCompanies?.length || 0
                            } Companies`}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Views
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {announcement.views.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Clicks
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {announcement.clicks.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-${theme.textSecondary} text-xs`}>
                        Created
                      </p>
                      <p className={`text-${theme.text} text-sm font-medium`}>
                        {announcement.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {announcement.scheduledAt && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-${theme.textSecondary} text-sm`}>
                        Scheduled for:{" "}
                        {new Date(announcement.scheduledAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {announcement.expiresAt && (
                    <div className="flex items-center space-x-2">
                      <Clock
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-${theme.textSecondary} text-sm`}>
                        Expires:{" "}
                        {new Date(announcement.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    theme={userType}
                    onClick={() => handleToggleStatus(announcement.id)}
                  >
                    {announcement.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    theme={userType}
                    onClick={() => openEditModal(announcement)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    theme={userType}
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Announcement"
        size="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            theme={userType}
            placeholder="Announcement title..."
          />

          <div>
            <label
              className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
            >
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              placeholder="Announcement content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              theme={userType}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>

            <Select
              label="Target"
              value={formData.targetType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, targetType: e.target.value }))
              }
              theme={userType}
            >
              <option value="all">All Companies</option>
              <option value="companies">Specific Companies</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Action URL (Optional)"
              value={formData.actionUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actionUrl: e.target.value }))
              }
              theme={userType}
              placeholder="/path/to/action"
            />

            <Input
              label="Action Text (Optional)"
              value={formData.actionText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actionText: e.target.value }))
              }
              theme={userType}
              placeholder="Learn More"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Schedule For (Optional)"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduledAt: e.target.value,
                }))
              }
              theme={userType}
            />

            <Input
              label="Expires At (Optional)"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
              }
              theme={userType}
            />
          </div>

          <div className="flex items-center space-x-3 justify-end pt-4">
            <Button
              variant="outline"
              theme={userType}
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              theme={userType}
              onClick={handleCreateAnnouncement}
            >
              Create Announcement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Announcement"
        size="max-w-2xl"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            theme={userType}
            placeholder="Announcement title..."
          />

          <div>
            <label
              className={`block text-sm font-medium text-${theme.textSecondary} mb-2`}
            >
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              className={`w-full px-3 py-2 ${theme.glass} border border-${theme.border} rounded-lg text-${theme.text} placeholder-${theme.textSecondary} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              placeholder="Announcement content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              theme={userType}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>

            <Select
              label="Target"
              value={formData.targetType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, targetType: e.target.value }))
              }
              theme={userType}
            >
              <option value="all">All Companies</option>
              <option value="companies">Specific Companies</option>
            </Select>
          </div>

          <div className="flex items-center space-x-3 justify-end pt-4">
            <Button
              variant="outline"
              theme={userType}
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              theme={userType}
              onClick={handleUpdateAnnouncement}
            >
              Update Announcement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementManager;
