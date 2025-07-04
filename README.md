
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
│     │  │  └─ adminController.controller.js
│     │  ├─ company
│     │  │  ├─ companyController.controller.js
│     │  │  └─ orgController.controller.js
│     │  └─ employee
│     │     └─ empolyeeController.controller.js
│     ├─ middlewares
│     │  ├─ auth.middleware.js
│     │  ├─ error.middleware.js
│     │  └─ upload.middleware.js
│     ├─ models
│     │  ├─ client.model.js
│     │  ├─ company.model.js
│     │  ├─ department.model.js
│     │  ├─ designation.model.js
│     │  ├─ employee.model.js
│     │  ├─ gamification.model.js
│     │  ├─ performance.model.js
│     │  ├─ role.model.js
│     │  └─ subdepartment.model.js
│     ├─ routes
│     │  ├─ admin.route.js
│     │  ├─ company.route.js
│     │  ├─ employee.route.js
│     │  └─ index.route.js
│     ├─ services
│     │  └─ emailService.service.js
│     └─ utils
│        ├─ ApiError.js
│        ├─ ApiResponse.js
│        ├─ asyncHandler.js
│        ├─ helpers.js
│        └─ jwtHelper.js
├─ frontend
│  ├─ eslint.config.js
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
│  │  │  ├─ company.api.js
│  │  │  ├─ employee.api.js
│  │  │  ├─ index.js
│  │  │  └─ organization.api.js
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
│  │  │  ├─ common
│  │  │  │  ├─ ConfirmDialog.jsx
│  │  │  │  ├─ DataTable.jsx
│  │  │  │  ├─ EmptyState.jsx
│  │  │  │  ├─ ExportButton.jsx
│  │  │  │  ├─ FilterPanel.jsx
│  │  │  │  ├─ ImportButton.jsx
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
│  │  │  │  ├─ MultiSelectField.jsx
│  │  │  │  └─ SelectField.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ BreadCrumb.jsx
│  │  │  │  ├─ DashboardLayout.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ HomeLayout.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  └─ Sidebar.jsx
│  │  │  ├─ organization
│  │  │  │  ├─ AddDepartmentModal.jsx
│  │  │  │  ├─ AddRoleModal.jsx
│  │  │  │  ├─ AddSubDepartmentModal.jsx
│  │  │  │  ├─ common
│  │  │  │  │  ├─ OrgHierarchy.jsx
│  │  │  │  │  └─ OrgStructureStats.jsx
│  │  │  │  ├─ departments
│  │  │  │  │  ├─ DepartmentCard.jsx
│  │  │  │  │  └─ DepartmentHierarchy.jsx
│  │  │  │  ├─ designations
│  │  │  │  │  └─ DesignationCard.jsx
│  │  │  │  ├─ OrgDataTable.jsx
│  │  │  │  ├─ roles
│  │  │  │  │  ├─ RoleCard.jsx
│  │  │  │  │  └─ RolePermissions.jsx
│  │  │  │  └─ subdepartments
│  │  │  │     └─ SubDepartmentCard.jsx
│  │  │  ├─ testing
│  │  │  │  └─ IntegrationTest.jsx
│  │  │  └─ ui
│  │  │     ├─ Badge.jsx
│  │  │     ├─ Button.jsx
│  │  │     ├─ Card.jsx
│  │  │     ├─ Dropdown.jsx
│  │  │     ├─ Input.jsx
│  │  │     ├─ LoadingSpinner.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ Pagination.jsx
│  │  │     ├─ Select.jsx
│  │  │     ├─ Table.jsx
│  │  │     └─ Toast.jsx
│  │  ├─ context
│  │  │  ├─ CompanyContext.jsx
│  │  │  ├─ EmployeeContext.jsx
│  │  │  └─ OrganizationContext.jsx
│  │  ├─ hooks
│  │  │  ├─ useApi.jsx
│  │  │  ├─ useAuth.jsx
│  │  │  ├─ useEmployee.jsx
│  │  │  ├─ useLocalStorage.jsx
│  │  │  ├─ useOrganization.jsx
│  │  │  ├─ usePagination.jsx
│  │  │  └─ useSearch.jsx
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
│  │  └─ pages
│  │     ├─ admin
│  │     │  ├─ AdminDashboard.jsx
│  │     │  ├─ CompanyManagement.jsx
│  │     │  ├─ DetailedCompany.jsx
│  │     │  ├─ EmployeeFilterAdmin.jsx
│  │     │  ├─ EmployeeManagementAdmin.jsx
│  │     │  ├─ PlatformStats.jsx
│  │     │  └─ ShowCompany.jsx
│  │     ├─ auth
│  │     │  ├─ AdminLogin.jsx
│  │     │  ├─ CompanyLogin.jsx
│  │     │  ├─ CompanySignup.jsx
│  │     │  ├─ EmployeeLogin.jsx
│  │     │  ├─ LoginModal.jsx
│  │     │  ├─ signup
│  │     │  │  ├─ CompanySignup.jsx
│  │     │  │  ├─ SignupStep1.jsx
│  │     │  │  ├─ SignupStep2.jsx
│  │     │  │  ├─ SignupStep3.jsx
│  │     │  │  ├─ SignupStep4.jsx
│  │     │  │  └─ SignupSuccess.jsx
│  │     │  └─ SignupModal.jsx
│  │     ├─ ClaimIntake.jsx
│  │     ├─ ClientManagement.jsx
│  │     ├─ company
│  │     │  ├─ CompanyDashboard.jsx
│  │     │  ├─ CompanyProfile.jsx
│  │     │  ├─ CompanySettings.jsx
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
│  │     │  ├─ EmployeeProfile.jsx
│  │     │  ├─ MyPerformance.jsx
│  │     │  ├─ ProfileCard.jsx
│  │     │  └─ UploadAvatar.jsx
│  │     └─ HomePage.jsx
│  └─ vite.config.js
└─ README.md

```