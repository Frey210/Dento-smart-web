import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { PageLayout } from './layouts/PageLayout';

// Placeholder Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

import { LiveMonitoring } from './pages/dashboard/LiveMonitoring';
import { PatientSessions } from './pages/dashboard/PatientSessions';
import { ResearchAnalytics } from './pages/dashboard/ResearchAnalytics';
import { Reporting } from './pages/dashboard/Reporting';
import { DeviceManagement } from './pages/dashboard/DeviceManagement';
import { Calibration } from './pages/dashboard/Calibration';

import { PatientList } from './pages/patients/PatientList';
import { NewPatient } from './pages/patients/NewPatient';
import { PatientDetail } from './pages/patients/PatientDetail';

import { DeviceList } from './pages/devices/DeviceList';
import { AddDevice } from './pages/devices/AddDevice';
import { hasSession } from './services/authSession';
import { AdminPanel } from './pages/admin/AdminPanel';
import { AccountSettings } from './pages/settings/Account';
import { ToastProvider } from './components/Toast';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!hasSession()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RedirectIfAuth({ children }: { children: JSX.Element }) {
  if (hasSession()) {
    return <Navigate to="/dashboard/live-monitoring" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
            <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
            <Route path="/forgot-password" element={<RedirectIfAuth><ForgotPassword /></RedirectIfAuth>} />
            <Route path="/reset-password" element={<RedirectIfAuth><ResetPassword /></RedirectIfAuth>} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<RequireAuth><PageLayout /></RequireAuth>}>
            <Route path="/" element={<Navigate to="/dashboard/live-monitoring" replace />} />
            
            <Route path="/dashboard/live-monitoring" element={<LiveMonitoring />} />
            <Route path="/dashboard/patient-sessions" element={<PatientSessions />} />
            <Route path="/dashboard/research-analytics" element={<ResearchAnalytics />} />
            <Route path="/dashboard/reporting" element={<Reporting />} />
            <Route path="/dashboard/device-management" element={<DeviceManagement />} />
            <Route path="/dashboard/calibration" element={<Calibration />} />

            {/* Patient Routes */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<NewPatient />} />
            <Route path="/patients/:id" element={<PatientDetail />} />

            {/* Device Routes */}
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/devices/new" element={<AddDevice />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Settings */}
            <Route path="/settings/account" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
