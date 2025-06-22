import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '@/components/layout/PageLoader';

const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const Homepage = lazy(() => import('@/pages/Homepage.jsx'));
const Login = lazy(() => import('@/pages/Login.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));
const Dashboard = lazy(() => import('@/pages/Dashboard.jsx'));
const ClientManagement = lazy(() => import('@/pages/ClientManagement.jsx'));
const AddClient = lazy(() => import('@/pages/AddClient.jsx'));
const SOWManagement = lazy(() => import('@/pages/SOWManagement.jsx'));
const EmployeeManagement = lazy(() => import('@/pages/EmployeeManagement.jsx'));
const ClaimIntake = lazy(() => import('@/pages/ClaimIntake.jsx'));
const SLATimer = lazy(() => import('@/pages/SLATimer.jsx'));
const QAAudit = lazy(() => import('@/pages/QAAudit.jsx'));
const QAAuditFormPage = lazy(() => import('@/pages/QAAuditFormPage.jsx'));
const EmployeeFeedback = lazy(() => import('@/pages/EmployeeFeedback.jsx'));
const Gamification = lazy(() => import('@/pages/Gamification.jsx'));
const ProductivityDashboard = lazy(() => import('@/pages/ProductivityDashboard.jsx'));
const Reports = lazy(() => import('@/pages/Reports.jsx'));
const Settings = lazy(() => import('@/pages/Settings.jsx'));
const Integrations = lazy(() => import('@/pages/Integrations.jsx'));
const FloatingPool = lazy(() => import('@/pages/FloatingPool.jsx'));
const SOPManagement = lazy(() => import('@/pages/SOPManagement.jsx'));
const ChargeEntry = lazy(() => import('@/pages/ChargeEntry.jsx'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/sow" element={<SOWManagement />} />
          <Route path="/sop-management" element={<SOPManagement />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/claims" element={<ClaimIntake />} />
          <Route path="/charge-entry" element={<ChargeEntry />} />
          <Route path="/floating-pool" element={<FloatingPool />} />
          <Route path="/sla" element={<SLATimer />} />
          <Route path="/qa" element={<QAAudit />} />
          <Route path="/qa/audit/:claimId" element={<QAAuditFormPage />} />
          <Route path="/feedback" element={<EmployeeFeedback />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/productivity" element={<ProductivityDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/integrations" element={<Integrations />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;