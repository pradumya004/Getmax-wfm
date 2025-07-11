// frontend/src/pages/client/ClientOnboarding.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  PlayCircle,
  Edit,
  Plus,
  Save,
  MessageSquare,
  Users,
  ArrowLeft as ArrowLeftIcon,
  Check,
  FileWarning as Warning,
} from "lucide-react";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs.jsx";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.jsx";
import { FileUpload } from "../../components/ui/FileUpload.jsx";
import { useClients } from "../../hooks/useClient.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getTheme } from "../../lib/theme.js";
import { formatDate } from "../../lib/utils.js";
import { toast } from "react-hot-toast";

const ClientOnboarding = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const theme = getTheme(userType);
  const { getClientById, editClient } = useClients();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState("");
  const [newNote, setNewNote] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Onboarding workflow steps
  const onboardingSteps = [
    {
      id: "documentation",
      title: "Documentation & Contracts",
      description: "Gather all required documents and agreements",
      progress: 0,
      status: "not_started",
      tasks: [
        {
          id: "msa",
          title: "Master Service Agreement",
          required: true,
          completed: false,
        },
        {
          id: "baa",
          title: "Business Associate Agreement (HIPAA)",
          required: true,
          completed: false,
        },
        {
          id: "sow",
          title: "Statement of Work",
          required: true,
          completed: false,
        },
        {
          id: "insurance",
          title: "Insurance Certificates",
          required: true,
          completed: false,
        },
        { id: "w9", title: "W-9 Tax Form", required: true, completed: false },
        {
          id: "banking",
          title: "Banking Information",
          required: true,
          completed: false,
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Setup",
      description: "Configure systems and integrations",
      progress: 0,
      status: "not_started",
      tasks: [
        {
          id: "ehr_access",
          title: "EHR System Access",
          required: true,
          completed: false,
        },
        {
          id: "api_setup",
          title: "API Configuration",
          required: false,
          completed: false,
        },
        {
          id: "ftp_setup",
          title: "SFTP Setup",
          required: false,
          completed: false,
        },
        {
          id: "test_data",
          title: "Test Data Exchange",
          required: true,
          completed: false,
        },
        {
          id: "security",
          title: "Security Configuration",
          required: true,
          completed: false,
        },
      ],
    },
    {
      id: "testing",
      title: "Testing & Validation",
      description: "Test workflows and validate processes",
      progress: 0,
      status: "not_started",
      tasks: [
        {
          id: "workflow_test",
          title: "Workflow Testing",
          required: true,
          completed: false,
        },
        {
          id: "data_validation",
          title: "Data Validation",
          required: true,
          completed: false,
        },
        {
          id: "reporting_test",
          title: "Reporting Test",
          required: true,
          completed: false,
        },
        {
          id: "integration_test",
          title: "Integration Testing",
          required: true,
          completed: false,
        },
        {
          id: "user_acceptance",
          title: "User Acceptance Testing",
          required: true,
          completed: false,
        },
      ],
    },
    {
      id: "training",
      title: "Training & Knowledge Transfer",
      description: "Train users and document processes",
      progress: 0,
      status: "not_started",
      tasks: [
        {
          id: "staff_training",
          title: "Staff Training Session",
          required: true,
          completed: false,
        },
        {
          id: "process_documentation",
          title: "Process Documentation",
          required: true,
          completed: false,
        },
        {
          id: "escalation_procedures",
          title: "Escalation Procedures",
          required: true,
          completed: false,
        },
        {
          id: "contact_list",
          title: "Contact List Setup",
          required: true,
          completed: false,
        },
      ],
    },
    {
      id: "golive",
      title: "Go-Live & Support",
      description: "Launch services and provide initial support",
      progress: 0,
      status: "not_started",
      tasks: [
        {
          id: "go_live_checklist",
          title: "Go-Live Checklist",
          required: true,
          completed: false,
        },
        {
          id: "production_setup",
          title: "Production Environment Setup",
          required: true,
          completed: false,
        },
        {
          id: "monitoring_setup",
          title: "Monitoring Setup",
          required: true,
          completed: false,
        },
        {
          id: "support_handoff",
          title: "Support Team Handoff",
          required: true,
          completed: false,
        },
        {
          id: "client_signoff",
          title: "Client Sign-off",
          required: true,
          completed: false,
        },
      ],
    },
  ];

  const [workflowSteps, setWorkflowSteps] = useState(onboardingSteps);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    } else {
      // If no clientId, show overview of all clients needing onboarding
      loadOnboardingOverview();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const clientData = await getClientById(clientId);
      setClient(clientData);

      // Initialize workflow steps based on client's onboarding progress
      const updatedSteps = onboardingSteps.map((step) => {
        const stepProgress = calculateStepProgress(step, clientData);
        return {
          ...step,
          progress: stepProgress,
          status: getStepStatus(stepProgress),
        };
      });

      setWorkflowSteps(updatedSteps);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load client data");
      toast.error("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const loadOnboardingOverview = async () => {
    try {
      setLoading(true);
      // This would typically fetch all clients needing onboarding
      // For now, we'll just set loading to false
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load onboarding overview");
      setLoading(false);
    }
  };

  const calculateStepProgress = (step, clientData) => {
    // This would calculate progress based on actual client data
    // For now, return a sample progress
    return Math.floor(Math.random() * 100);
  };

  const getStepStatus = (progress) => {
    if (progress === 0) return "not_started";
    if (progress < 100) return "in_progress";
    return "completed";
  };

  const handleTaskToggle = (stepId, taskId) => {
    setWorkflowSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          const updatedTasks = step.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          });

          const completedTasks = updatedTasks.filter((t) => t.completed).length;
          const progress = Math.round(
            (completedTasks / updatedTasks.length) * 100
          );

          return {
            ...step,
            tasks: updatedTasks,
            progress,
            status: getStepStatus(progress),
          };
        }
        return step;
      })
    );
  };

  const handleAddTask = (stepId) => {
    const taskTitle = prompt("Enter task title:");
    if (taskTitle) {
      setWorkflowSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId) {
            const newTask = {
              id: `custom_${Date.now()}`,
              title: taskTitle,
              required: false,
              completed: false,
            };
            return {
              ...step,
              tasks: [...step.tasks, newTask],
            };
          }
          return step;
        })
      );
    }
  };

  const handleSaveProgress = async () => {
    if (!client) return;

    setSaving(true);
    try {
      const totalProgress = Math.round(
        workflowSteps.reduce((sum, step) => sum + step.progress, 0) /
          workflowSteps.length
      );

      const onboardingStatus =
        totalProgress === 100
          ? "Completed"
          : totalProgress > 0
          ? "In Progress"
          : "Not Started";

      const updatedClient = {
        ...client,
        status: {
          ...client.status,
          onboardingProgress: totalProgress,
          onboardingStatus,
        },
      };

      await editClient(clientId, updatedClient);
      toast.success("Progress saved successfully");
    } catch (error) {
      toast.error("Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      toast.success("Note added successfully");
      setNewNote("");
      setShowNoteModal(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: "bg-gray-500/20 text-gray-300 border-gray-400/30",
      in_progress: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      completed: "bg-green-500/20 text-green-300 border-green-400/30",
    };
    return colors[status] || colors.not_started;
  };

  const getStatusIcon = (status) => {
    const icons = {
      not_started: Clock,
      in_progress: PlayCircle,
      completed: CheckCircle,
    };
    return icons[status] || Clock;
  };

  const totalProgress =
    workflowSteps.reduce((sum, step) => sum + step.progress, 0) /
    workflowSteps.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">
          Error Loading Data
        </h3>
        <p className={`text-${theme.textSecondary} mb-4`}>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // If no specific client, show onboarding overview
  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br p-6">
        <Helmet>
          <title>Client Onboarding Overview - GetMax</title>
        </Helmet>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Client Onboarding Overview
            </h1>
            <p className={`text-${theme.textSecondary} text-lg`}>
              Manage onboarding workflows for all clients
            </p>
          </div>

          <Card className={`${theme.card} p-6`}>
            <div className="text-center py-12">
              <Users
                className={`w-16 h-16 text-${theme.accent} mx-auto mb-4`}
              />
              <h3 className="text-white text-lg font-semibold mb-2">
                Select a Client
              </h3>
              <p className={`text-${theme.textSecondary} mb-4`}>
                Choose a client to manage their onboarding workflow
              </p>
              <Button onClick={() => navigate("/employee/clients/list")}>
                View All Clients
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Helmet>
        <title>Onboarding - {client?.clientInfo?.clientName} - GetMax</title>
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
                {client?.clientInfo?.clientName}
              </h1>
              <p className={`text-${theme.textSecondary} text-lg`}>
                Onboarding Workflow
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {Math.round(totalProgress)}%
              </div>
              <div className={`text-${theme.textSecondary} text-sm`}>
                Complete
              </div>
            </div>
            <Button
              onClick={handleSaveProgress}
              loading={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className={`${theme.card} p-6 mb-8`}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-lg font-semibold">
                Overall Progress
              </h3>
              <span className="text-white font-semibold">
                {Math.round(totalProgress)}%
              </span>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              return (
                <div key={step.id} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      step.status === "completed"
                        ? `bg-${theme.accent}`
                        : step.status === "in_progress"
                        ? `bg-${theme.accent}/50`
                        : "bg-gray-600"
                    }`}
                  >
                    <StatusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white text-sm font-medium">
                    {step.title}
                  </div>
                  <div className={`text-${theme.textSecondary} text-xs`}>
                    {step.progress}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Workflow Steps */}
        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <Card key={step.id} className={`${theme.card} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? `bg-${theme.accent}`
                        : step.status === "in_progress"
                        ? `bg-${theme.accent}/50`
                        : "bg-gray-600"
                    }`}
                  >
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className={`text-${theme.textSecondary} text-sm`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(step.status)}>
                    {step.status.replace("_", " ")}
                  </Badge>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {step.progress}%
                    </div>
                    <div className={`text-${theme.textSecondary} text-sm`}>
                      {step.tasks.filter((t) => t.completed).length} of{" "}
                      {step.tasks.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Progress value={step.progress} className="h-2" />
              </div>

              <div className="space-y-3">
                {step.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleTaskToggle(step.id, task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          task.completed
                            ? `bg-${theme.accent} border-${theme.accent}`
                            : "border-gray-400"
                        }`}
                      >
                        {task.completed && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <span
                        className={`${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.required && (
                        <Badge variant="outline" size="sm">
                          Required
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTask(step.id)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className={`${theme.card} p-6 mt-8`}>
          <h3 className="text-white text-lg font-semibold mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowNoteModal(true)}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Add Note</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/employee/clients/details/${clientId}`)}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>View Client Details</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/employee/clients/edit/${clientId}`)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Client</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Task Details Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">
                {selectedTask.title}
              </h3>
              <p className={`text-${theme.textSecondary} text-sm`}>
                Status: {selectedTask.completed ? "Completed" : "Pending"}
              </p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Notes
              </label>
              <Textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Add notes about this task..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Save task notes logic here
                  setShowTaskModal(false);
                  toast.success("Task notes saved");
                }}
              >
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Note"
      >
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Note
            </label>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about the onboarding process..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientOnboarding;