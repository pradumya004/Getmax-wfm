// frontend/src/pages/employee/EmployeeTasks.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Calendar,
  Play,
  Pause,
  Eye,
  RefreshCw,
  Download,
  Plus,
  User,
  Building,
  DollarSign,
  Target,
  ArrowRight,
  Timer,
  Star,
  Bookmark,
  Flag,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { useEmployeeTasks } from "../../hooks/useEmployee.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate, formatCurrency } from "../../lib/utils.js";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";

const EmployeeTasks = () => {
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { tasks, stats, loading, error, fetchTasks } = useEmployeeTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock task data
  const mockTasks = [
    {
      id: 1,
      taskId: "CLM-2024-001",
      title: "Medical Claim Review",
      description: "Review and process medical claim for patient John Doe",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-01-20T14:00:00Z",
      assignedDate: "2024-01-18T09:00:00Z",
      startedDate: "2024-01-18T14:30:00Z",
      client: "Healthcare Plus",
      patient: "John Doe",
      claimAmount: 1250.0,
      timeSpent: 45,
      estimatedTime: 60,
      progress: 75,
      category: "Medical Claims",
      tags: ["medical", "urgent", "review"],
      notes: "Initial review completed, pending documentation",
    },
    {
      id: 2,
      taskId: "CLM-2024-002",
      title: "Dental Claim Processing",
      description: "Process dental claim for routine checkup",
      status: "completed",
      priority: "medium",
      dueDate: "2024-01-19T16:00:00Z",
      assignedDate: "2024-01-17T11:00:00Z",
      completedDate: "2024-01-19T15:45:00Z",
      client: "Dental Care Corp",
      patient: "Jane Smith",
      claimAmount: 350.0,
      timeSpent: 30,
      estimatedTime: 45,
      progress: 100,
      category: "Dental Claims",
      tags: ["dental", "routine", "approved"],
      notes: "Completed successfully, approved for payment",
    },
    {
      id: 3,
      taskId: "CLM-2024-003",
      title: "Vision Claim Analysis",
      description: "Analyze vision claim for prescription glasses",
      status: "pending",
      priority: "low",
      dueDate: "2024-01-22T12:00:00Z",
      assignedDate: "2024-01-20T10:00:00Z",
      client: "Vision Solutions",
      patient: "Bob Johnson",
      claimAmount: 450.0,
      timeSpent: 0,
      estimatedTime: 30,
      progress: 0,
      category: "Vision Claims",
      tags: ["vision", "glasses", "pending"],
      notes: "Awaiting initial review",
    },
    {
      id: 4,
      taskId: "CLM-2024-004",
      title: "Emergency Room Claim",
      description: "Process emergency room claim",
      status: "overdue",
      priority: "high",
      dueDate: "2024-01-18T18:00:00Z",
      assignedDate: "2024-01-16T08:00:00Z",
      client: "Emergency Care Network",
      patient: "Alice Brown",
      claimAmount: 2850.0,
      timeSpent: 120,
      estimatedTime: 90,
      progress: 85,
      category: "Emergency Claims",
      tags: ["emergency", "complex", "high-value"],
      notes: "Complex case requiring additional documentation",
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Tasks", color: "bg-gray-500" },
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
    { value: "completed", label: "Completed", color: "bg-green-500" },
    { value: "overdue", label: "Overdue", color: "bg-red-500" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.patient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get status counts
  const statusCounts = mockTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      in_progress: { variant: "primary", label: "In Progress" },
      completed: { variant: "success", label: "Completed" },
      overdue: { variant: "destructive", label: "Overdue" },
    };
    return statusConfig[status] || { variant: "secondary", label: status };
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: "secondary", label: "Low" },
      medium: { variant: "warning", label: "Medium" },
      high: { variant: "destructive", label: "High" },
    };
    return (
      priorityConfig[priority] || { variant: "secondary", label: priority }
    );
  };

  const getTimeUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (diff < 0) return "Overdue";
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return "Due soon";
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    if (newStatus === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", newStatus);
    }
    setSearchParams(searchParams);
  };

  const handleStartTask = (taskId) => {
    console.log("Starting task:", taskId);
    // TODO: Implement start task functionality
  };

  const handlePauseTask = (taskId) => {
    console.log("Pausing task:", taskId);
    // TODO: Implement pause task functionality
  };

  const handleCompleteTask = (taskId) => {
    console.log("Completing task:", taskId);
    // TODO: Implement complete task functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" theme={userType} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card theme={userType} className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Tasks</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchTasks()} theme={userType}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${theme.text}`}>My Tasks</h1>
          <p className={`text-${theme.textSecondary}`}>
            Manage your assigned tasks and track progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            theme={userType}
            onClick={() => fetchTasks()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" theme={userType}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions
          .filter((option) => option.value !== "all")
          .map((option) => (
            <Card key={option.value} theme={userType} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${option.color}`} />
                <div>
                  <p className={`text-sm text-${theme.textSecondary}`}>
                    {option.label}
                  </p>
                  <p className={`text-xl font-bold text-${theme.text}`}>
                    {statusCounts[option.value] || 0}
                  </p>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Filters */}
      <Card theme={userType} className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                theme={userType}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 text-${theme.textSecondary}`} />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border border-${theme.border} bg-${theme.glass} text-${theme.text} focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border border-${theme.border} bg-${theme.glass} text-${theme.text} focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card theme={userType} className="p-12 text-center">
            <FileText
              className={`w-16 h-16 text-${theme.textSecondary} mx-auto mb-4`}
            />
            <h3 className={`text-lg font-medium text-${theme.text} mb-2`}>
              No tasks found
            </h3>
            <p className={`text-${theme.textSecondary}`}>
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "You have no tasks assigned at the moment."}
            </p>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              theme={userType}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg bg-${theme.accent}/10 flex items-center justify-center`}
                    >
                      <FileText className={`w-5 h-5 text-${theme.accent}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-${theme.text}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm text-${theme.textSecondary}`}>
                        {task.taskId} • {task.client}
                      </p>
                    </div>
                  </div>

                  <div className="ml-13 space-y-3">
                    <p className={`text-sm text-${theme.textSecondary}`}>
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className={`text-${theme.textSecondary}`}>
                          {task.patient}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className={`text-${theme.textSecondary}`}>
                          {formatCurrency(task.claimAmount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={`text-${theme.textSecondary}`}>
                          {task.timeSpent}m / {task.estimatedTime}m
                        </span>
                      </div>
                    </div>

                    {task.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm text-${theme.textSecondary}`}
                          >
                            Progress
                          </span>
                          <span
                            className={`text-sm font-medium text-${theme.text}`}
                          >
                            {task.progress}%
                          </span>
                        </div>
                        <Progress
                          value={task.progress}
                          className="h-2"
                          theme={userType}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusBadge(task.status).variant}
                      theme={userType}
                    >
                      {getStatusBadge(task.status).label}
                    </Badge>
                    <Badge
                      variant={getPriorityBadge(task.priority).variant}
                      theme={userType}
                    >
                      {getPriorityBadge(task.priority).label}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-medium text-${theme.text}`}>
                      {getTimeUntilDue(task.dueDate)}
                    </p>
                    <p className={`text-xs text-${theme.textSecondary}`}>
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === "pending" && (
                      <Button
                        size="sm"
                        theme={userType}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTask(task.id);
                        }}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {task.status === "in_progress" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          theme={userType}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePauseTask(task.id);
                          }}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          theme={userType}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTask(task.id);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      </>
                    )}
                    {task.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        theme={userType}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          title={selectedTask.title}
          size="lg"
        >
          <div className="space-y-6 max-w-7xl overflow-visible">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-xl font-semibold text-${theme.text}`}>
                  {selectedTask.title}
                </h3>
                <p className={`text-sm text-${theme.textSecondary} mt-1`}>
                  {selectedTask.taskId} • {selectedTask.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getStatusBadge(selectedTask.status).variant}
                  theme={userType}
                >
                  {getStatusBadge(selectedTask.status).label}
                </Badge>
                <Badge
                  variant={getPriorityBadge(selectedTask.priority).variant}
                  theme={userType}
                >
                  {getPriorityBadge(selectedTask.priority).label}
                </Badge>
              </div>
            </div>

            {/* Task Description */}
            <div>
              <h4 className={`font-medium text-${theme.text} mb-2`}>
                Description
              </h4>
              <p className={`text-${theme.textSecondary}`}>
                {selectedTask.description}
              </p>
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium text-${theme.text} mb-2`}>
                    Client Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.text}`}>
                        {selectedTask.client}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`w-4 h-4 text-${theme.textSecondary}`} />
                      <span className={`text-sm text-${theme.text}`}>
                        {selectedTask.patient}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.text}`}>
                        {formatCurrency(selectedTask.claimAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium text-${theme.text} mb-2`}>
                    Timeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.text}`}>
                        Due: {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 text-${theme.textSecondary}`}
                      />
                      <span className={`text-sm text-${theme.text}`}>
                        Assigned: {formatDate(selectedTask.assignedDate)}
                      </span>
                    </div>
                    {selectedTask.completedDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          className={`w-4 h-4 text-${theme.textSecondary}`}
                        />
                        <span className={`text-sm text-${theme.text}`}>
                          Completed: {formatDate(selectedTask.completedDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium text-${theme.text} mb-2`}>
                    Progress
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm text-${theme.textSecondary}`}>
                          Completion
                        </span>
                        <span
                          className={`text-sm font-medium text-${theme.text}`}
                        >
                          {selectedTask.progress}%
                        </span>
                      </div>
                      <Progress
                        value={selectedTask.progress}
                        className="h-2"
                        theme={userType}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm text-${theme.textSecondary}`}>
                        Time Spent
                      </span>
                      <span
                        className={`text-sm font-medium text-${theme.text}`}
                      >
                        {selectedTask.timeSpent}m / {selectedTask.estimatedTime}
                        m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <div>
                <h4 className={`font-medium text-${theme.text} mb-2`}>Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      theme={userType}
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className={`font-medium text-${theme.text} mb-2`}>Notes</h4>
              <div
                className={`p-3 rounded-lg bg-${theme.glass} border border-${theme.border}`}
              >
                <p className={`text-sm text-${theme.text}`}>
                  {selectedTask.notes || "No notes available"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                theme={userType}
                onClick={() => setShowTaskModal(false)}
              >
                Close
              </Button>
              {selectedTask.status === "pending" && (
                <Button
                  theme={userType}
                  onClick={() => {
                    handleStartTask(selectedTask.id);
                    setShowTaskModal(false);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Task
                </Button>
              )}
              {selectedTask.status === "in_progress" && (
                <Button
                  theme={userType}
                  onClick={() => {
                    handleCompleteTask(selectedTask.id);
                    setShowTaskModal(false);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Task
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeTasks;
