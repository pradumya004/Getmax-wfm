
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
│     │  ├─ company
│     │  │  ├─ companyController.controller.js
│     │  │  └─ orgController.controller.js
│     │  ├─ employee
│     │  │  └─ empolyeeController.controller.js
│     │  └─ organization
│     │     ├─ departmentContoller.controller.js
│     │     ├─ designationController.controller.js
│     │     ├─ organizationEnums.controller.js
│     │     ├─ roleContoller.controller.js
│     │     └─ subDepartmentController.controller.js
│     ├─ middlewares
│     │  ├─ auth.middleware.js
│     │  ├─ error.middleware.js
│     │  ├─ masterAdminAuth.middleware.js
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
│     │  ├─ index.route.js
│     │  ├─ masterAdmin.route.js
│     │  └─ organization.route.js
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
│  │  │  ├─ masterAdmin.api.js
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
│  │  │  ├─ testing
│  │  │  │  └─ IntegrationTest.jsx
│  │  │  └─ ui
│  │  │     ├─ Badge.jsx
│  │  │     ├─ Button.jsx
│  │  │     ├─ Card.jsx
│  │  │     ├─ Checkbox.jsx
│  │  │     ├─ CreatableSelect.jsx
│  │  │     ├─ Dropdown.jsx
│  │  │     ├─ Input.jsx
│  │  │     ├─ LoadingSpinner.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ MultiSelectField.jsx
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
│  │  │  ├─ useCompany.jsx
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
│  │     │  ├─ CompanyManagement.jsx
│  │     │  ├─ DetailedCompany.jsx
│  │     │  ├─ EmployeeFilterAdmin.jsx
│  │     │  ├─ EmployeeManagementAdmin.jsx
│  │     │  ├─ MasterAdminDashboard.jsx
│  │     │  ├─ PlatformStats.jsx
│  │     │  └─ ShowCompany.jsx
│  │     ├─ auth
│  │     │  ├─ CompanyLogin.jsx
│  │     │  ├─ CompanySignup.jsx
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
│  │     │  ├─ EmployeeProfile.jsx
│  │     │  ├─ MyPerformance.jsx
│  │     │  ├─ ProfileCard.jsx
│  │     │  └─ UploadAvatar.jsx
│  │     └─ HomePage.jsx
│  └─ vite.config.js
├─ package-lock.json
├─ package.json
└─ README.md

```