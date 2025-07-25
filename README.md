
```
Getmax-wfm
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ uploads
│  │     ├─ avatars
│  │     ├─ bulk
│  │     ├─ documents
│  │     └─ temp
│  ├─ server.js
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ cloudinary.config.js
│     │  ├─ connection.config.js
│     │  ├─ email.config.js
│     │  └─ multer.config.js
│     ├─ constants.js
│     ├─ controllers
│     │  ├─ admin
│     │  │  ├─ adminController.controller.js
│     │  │  └─ masterAdminController.controller.js
│     │  ├─ claimtask
│     │  │  └─ claimTaskController.controller.js
│     │  ├─ client
│     │  │  └─ clientController.controller.js
│     │  ├─ company
│     │  │  ├─ companyController.controller.js
│     │  │  └─ orgController.controller.js
│     │  ├─ employee
│     │  │  └─ empolyeeController.controller.js
│     │  ├─ organization
│     │  │  ├─ departmentContoller.controller.js
│     │  │  ├─ designationController.controller.js
│     │  │  ├─ organizationEnums.controller.js
│     │  │  ├─ roleContoller.controller.js
│     │  │  └─ subDepartmentController.controller.js
│     │  ├─ patient
│     │  │  └─ patientController.controller.js
│     │  ├─ payer
│     │  │  └─ payerController.controller.js
│     │  └─ sow
│     │     └─ sowController.controller.js
│     ├─ middlewares
│     │  ├─ auth.middleware.js
│     │  ├─ error.middleware.js
│     │  ├─ masterAdminAuth.middleware.js
│     │  └─ upload.middleware.js
│     ├─ models
│     │  ├─ claimtasks-model.js
│     │  ├─ client-model.js
│     │  ├─ company.model.js
│     │  ├─ department.model.js
│     │  ├─ designation.model.js
│     │  ├─ employee.model.js
│     │  ├─ floating-pool-model.js
│     │  ├─ gamification.model.js
│     │  ├─ notes-model.js
│     │  ├─ notifications-model.js
│     │  ├─ patient-model.js
│     │  ├─ payer-model.js
│     │  ├─ performance.model.js
│     │  ├─ qa-audit-model.js
│     │  ├─ role.model.js
│     │  ├─ sla-tracking-model.js
│     │  ├─ sow.model.js
│     │  └─ subdepartment.model.js
│     ├─ routes
│     │  ├─ admin.route.js
│     │  ├─ claimTask.route.js
│     │  ├─ client.route.js
│     │  ├─ company.route.js
│     │  ├─ employee.route.js
│     │  ├─ index.route.js
│     │  ├─ masterAdmin.route.js
│     │  ├─ organization.route.js
│     │  ├─ patient.route.js
│     │  ├─ payer.route.js
│     │  └─ sow.route.js
│     ├─ scripts
│     │  ├─ adapters
│     │  │  └─ claimmdAdapter.js
│     │  └─ payerSync.js
│     ├─ services
│     │  └─ emailService.service.js
│     └─ utils
│        ├─ ApiError.js
│        ├─ ApiResponse.js
│        ├─ asyncHandler.js
│        ├─ helpers.js
│        └─ jwtHelper.js
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ Frontend Zip.zip
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ admin.api.js
│  │  │  ├─ apiClient.js
│  │  │  ├─ auth.api.js
│  │  │  ├─ claim.api.js
│  │  │  ├─ client.api.js
│  │  │  ├─ company.api.js
│  │  │  ├─ employee.api.js
│  │  │  ├─ masterAdmin.api.js
│  │  │  ├─ organization.api.js
│  │  │  ├─ patient.api.js
│  │  │  ├─ payer.api.js
│  │  │  └─ sow.api.js
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ CompanyCard.jsx
│  │  │  │  ├─ CompanyTable.jsx
│  │  │  │  ├─ SubscriptionPlanModal.jsx
│  │  │  │  └─ SuspendCompanyModal.jsx
│  │  │  ├─ claims
│  │  │  │  ├─ AllocationRulesTab.jsx
│  │  │  │  └─ UploadIntakeTab.jsx
│  │  │  ├─ client
│  │  │  │  ├─ ClientActions.jsx
│  │  │  │  ├─ ClientCard.jsx
│  │  │  │  ├─ ClientFilters.jsx
│  │  │  │  ├─ ClientFinancialInfo.jsx
│  │  │  │  ├─ ClientIntegrationCard.jsx
│  │  │  │  ├─ ClientOnboardingProcess.jsx
│  │  │  │  ├─ ClientStatsCard.jsx
│  │  │  │  ├─ ClientStatusBadge.jsx
│  │  │  │  └─ ClientTable.jsx
│  │  │  ├─ common
│  │  │  │  ├─ BulkUploadModal.jsx
│  │  │  │  ├─ ConfirmDialog.jsx
│  │  │  │  ├─ DataProcessingModal.jsx
│  │  │  │  ├─ DataTable.jsx
│  │  │  │  ├─ EmptyState.jsx
│  │  │  │  ├─ ExcelPreview.jsx
│  │  │  │  ├─ ExportButton.jsx
│  │  │  │  ├─ FieldMapper.jsx
│  │  │  │  ├─ FilterPanel.jsx
│  │  │  │  ├─ ImportButton.jsx
│  │  │  │  ├─ ImportExportButtons.jsx
│  │  │  │  ├─ ProtectedRoute.jsx
│  │  │  │  ├─ SearchBar.jsx
│  │  │  │  ├─ StatCard.jsx
│  │  │  │  └─ StatusBadge.jsx
│  │  │  ├─ company
│  │  │  │  ├─ AddEmployeeModal.jsx
│  │  │  │  ├─ BulkUploadModal.jsx
│  │  │  │  ├─ CompanyProfileCard.jsx
│  │  │  │  ├─ CompanySettingsForm.jsx
│  │  │  │  ├─ EmployeeActions.jsx
│  │  │  │  ├─ EmployeeCard.jsx
│  │  │  │  ├─ EmployeeFilters.jsx
│  │  │  │  ├─ EmployeeStatsCard.jsx
│  │  │  │  └─ EmployeeTable.jsx
│  │  │  ├─ dashboard
│  │  │  │  ├─ ClaimSlaChart.jsx
│  │  │  │  ├─ EmployeeProductivityChart.jsx
│  │  │  │  ├─ GamificationFeedTile.jsx
│  │  │  │  ├─ ModuleHealthTile.jsx
│  │  │  │  ├─ PendingTasksTile.jsx
│  │  │  │  ├─ StatCard.jsx
│  │  │  │  └─ SystemAlertsTile.jsx
│  │  │  ├─ employee
│  │  │  │  ├─ AvatarUpload.jsx
│  │  │  │  ├─ EditProfileModal.jsx
│  │  │  │  ├─ EmployeeActions.jsx
│  │  │  │  ├─ LeaderboardCard.jsx
│  │  │  │  └─ PerformanceStats.jsx
│  │  │  ├─ forms
│  │  │  │  ├─ DatePicker.jsx
│  │  │  │  ├─ FileUpload.jsx
│  │  │  │  ├─ FormValidation.jsx
│  │  │  │  ├─ InputField.jsx
│  │  │  │  └─ SelectField.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ BreadCrumb.jsx
│  │  │  │  ├─ DashboardLayout.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ HomeLayout.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  └─ Sidebar.jsx
│  │  │  ├─ organization
│  │  │  │  ├─ common
│  │  │  │  │  ├─ OrgHierarchy.jsx
│  │  │  │  │  └─ OrgStructureStats.jsx
│  │  │  │  ├─ departments
│  │  │  │  │  ├─ AddDepartmentModal.jsx
│  │  │  │  │  ├─ DepartmentCard.jsx
│  │  │  │  │  └─ DepartmentHierarchy.jsx
│  │  │  │  ├─ designations
│  │  │  │  │  ├─ AddDesignationModal.jsx
│  │  │  │  │  └─ DesignationCard.jsx
│  │  │  │  ├─ OrgDataTable.jsx
│  │  │  │  ├─ roles
│  │  │  │  │  ├─ AddRoleModal.jsx
│  │  │  │  │  ├─ RoleCard.jsx
│  │  │  │  │  └─ RolePermissions.jsx
│  │  │  │  └─ subdepartments
│  │  │  │     ├─ AddSubDepartmentModal.jsx
│  │  │  │     └─ SubDepartmentCard.jsx
│  │  │  ├─ sow
│  │  │  │  ├─ SOWActions.jsx
│  │  │  │  ├─ SOWCard.jsx
│  │  │  │  ├─ SOWFilters.jsx
│  │  │  │  ├─ SOWPerformanceCard.jsx
│  │  │  │  ├─ SOWStatsCard.jsx
│  │  │  │  └─ SOWStatusBadge.jsx
│  │  │  ├─ testing
│  │  │  │  └─ IntegrationTest.jsx
│  │  │  └─ ui
│  │  │     ├─ Badge.jsx
│  │  │     ├─ Button.jsx
│  │  │     ├─ Card.jsx
│  │  │     ├─ Checkbox.jsx
│  │  │     ├─ CreatableSelect.jsx
│  │  │     ├─ Dropdown.jsx
│  │  │     ├─ FileUpload.jsx
│  │  │     ├─ Input.jsx
│  │  │     ├─ Label.jsx
│  │  │     ├─ LoadingSpinner.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ MultiSelectField.jsx
│  │  │     ├─ Pagination.jsx
│  │  │     ├─ Progress.jsx
│  │  │     ├─ Select.jsx
│  │  │     ├─ Table.jsx
│  │  │     ├─ Tabs.jsx
│  │  │     ├─ Textarea.jsx
│  │  │     └─ Toast.jsx
│  │  ├─ constants
│  │  │  ├─ employee.constants.js
│  │  │  └─ patient.constants.js
│  │  ├─ context
│  │  │  ├─ CompanyContext.jsx
│  │  │  ├─ EmployeeContext.jsx
│  │  │  └─ OrganizationContext.jsx
│  │  ├─ hooks
│  │  │  ├─ useApi.jsx
│  │  │  ├─ useAuth.jsx
│  │  │  ├─ useClaims.jsx
│  │  │  ├─ useClient.jsx
│  │  │  ├─ useCompany.jsx
│  │  │  ├─ useDebounce.jsx
│  │  │  ├─ useEmployee.jsx
│  │  │  ├─ useLocalStorage.jsx
│  │  │  ├─ useMasterAdmin.jsx
│  │  │  ├─ useOrganization.jsx
│  │  │  ├─ usePagination.jsx
│  │  │  ├─ usePatients.jsx
│  │  │  ├─ usePayers.jsx
│  │  │  ├─ useSearch.jsx
│  │  │  └─ useSows.jsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ auth.js
│  │  │  ├─ constants.js
│  │  │  ├─ formatter.js
│  │  │  ├─ permissions.js
│  │  │  ├─ theme.js
│  │  │  ├─ utils.js
│  │  │  └─ validation.js
│  │  ├─ main.jsx
│  │  ├─ mermaid
│  │  │  └─ MermaidGraph.jsx
│  │  └─ pages
│  │     ├─ admin
│  │     │  ├─ AnnouncementManager.jsx
│  │     │  ├─ AuditLogs.jsx
│  │     │  ├─ company
│  │     │  │  ├─ CompanyManagement.jsx
│  │     │  │  ├─ DetailedCompany.jsx
│  │     │  │  └─ ExportCompanies.jsx
│  │     │  ├─ employee
│  │     │  │  ├─ EmployeeManagementAdmin.jsx
│  │     │  │  └─ UserActivityMonitoring.jsx
│  │     │  ├─ EmployeeFilterAdmin.jsx
│  │     │  ├─ FeatureFlags.jsx
│  │     │  ├─ FinalcialDashboard.jsx
│  │     │  ├─ MasterAdminDashboard.jsx
│  │     │  ├─ MasterAdminProfile.jsx
│  │     │  ├─ NotificationCenter.jsx
│  │     │  ├─ PlatformSettings.jsx
│  │     │  ├─ SecurityCenter.jsx
│  │     │  ├─ ShowCompany.jsx
│  │     │  ├─ statistics
│  │     │  │  └─ PlatformStats.jsx
│  │     │  └─ system
│  │     │     ├─ ApiMonitoring.jsx
│  │     │     ├─ SystemHealth.jsx
│  │     │     └─ SystemPerformanceMonitor.jsx
│  │     ├─ auth
│  │     │  ├─ CompanyLogin.jsx
│  │     │  ├─ EmployeeLogin.jsx
│  │     │  ├─ LoginModal.jsx
│  │     │  ├─ MasterAdminLogin.jsx
│  │     │  ├─ signup
│  │     │  │  ├─ CompanySignup.jsx
│  │     │  │  ├─ SignupStep1.jsx
│  │     │  │  ├─ SignupStep2.jsx
│  │     │  │  ├─ SignupStep3.jsx
│  │     │  │  ├─ SignupStep4.jsx
│  │     │  │  └─ SignupSuccess.jsx
│  │     │  └─ SignupModal.jsx
│  │     ├─ ClaimIntake.jsx
│  │     ├─ client
│  │     │  ├─ client.constants.js
│  │     │  ├─ ClientBulkUpload.jsx
│  │     │  ├─ ClientDashboard.jsx
│  │     │  ├─ ClientDetails.jsx
│  │     │  ├─ ClientEdit.jsx
│  │     │  ├─ ClientIntake.jsx
│  │     │  ├─ ClientList.jsx
│  │     │  ├─ ClientOnboarding.jsx
│  │     │  └─ ClientReports.jsx
│  │     ├─ ClientManagement.jsx
│  │     ├─ company
│  │     │  ├─ CompanyDashboard.jsx
│  │     │  ├─ CompanyProfile.jsx
│  │     │  ├─ CompanySettings.jsx
│  │     │  ├─ CompanyUpdateForm.jsx
│  │     │  ├─ EmployeeDashboard.jsx
│  │     │  ├─ employees
│  │     │  │  ├─ AddEmployee.jsx
│  │     │  │  ├─ BulkEmployeeUpload.jsx
│  │     │  │  ├─ EditEmployee.jsx
│  │     │  │  ├─ EmployeeDetails.jsx
│  │     │  │  ├─ EmployeeManagement.jsx
│  │     │  │  └─ PerformanceLeaderboard.jsx
│  │     │  └─ organization
│  │     │     ├─ DepartmentManagement.jsx
│  │     │     ├─ DesignationManagement.jsx
│  │     │     ├─ OrganizationOverview.jsx
│  │     │     ├─ OrgHierarchyView.jsx
│  │     │     ├─ RoleManagement.jsx
│  │     │     └─ SubDepartmentManagement.jsx
│  │     ├─ employee
│  │     │  ├─ EditProfile.jsx
│  │     │  ├─ EmployeeDashboard.jsx
│  │     │  ├─ EmployeeFilter.jsx
│  │     │  ├─ EmployeePerformance.jsx
│  │     │  ├─ EmployeeProfile.jsx
│  │     │  ├─ EmployeeTasks.jsx
│  │     │  ├─ MyPerformance.jsx
│  │     │  ├─ ProfileCard.jsx
│  │     │  └─ UploadAvatar.jsx
│  │     ├─ GraphDashboard.jsx
│  │     ├─ HomePage.jsx
│  │     ├─ patient
│  │     │  ├─ PatientIntake.jsx
│  │     │  └─ PatientList.jsx
│  │     ├─ payer
│  │     │  └─ PayerList.jsx
│  │     └─ sow
│  │        ├─ SOWEdit.jsx
│  │        ├─ SowIntake.jsx
│  │        └─ SOWList.jsx
│  └─ vite.config.js
├─ README.md
├─ WFM Tool Development Walkthrough_.docx
└─ WFM Tool Development Walkthrough_.pdf

```