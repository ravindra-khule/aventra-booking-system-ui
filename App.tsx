import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { TourDetails } from './pages/TourDetails';
import { BookingWizardWithStripe } from './pages/booking/BookingWizardWithStripe';
import { TestPage } from './pages/TestPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BookingManager } from './pages/admin/BookingManager';
import { CustomerManager } from './pages/admin/CustomerManager';
import { WaitlistManager } from './pages/admin/WaitlistManager';
import { PromoCodeManager } from './pages/admin/PromoCodeManager';
import { EmailTemplates } from './pages/admin/marketing/EmailTemplates';
import { CustomerGroups } from './pages/admin/customers/CustomerGroups';
import { CommunicationLogs } from './pages/admin/customers/CommunicationLogs';
import { TourManagement } from './pages/admin/tours/TourManagement';
import { PricingAvailability } from './pages/admin/tours/PricingAvailability';
import { Itineraries } from './pages/admin/tours/Itineraries';
import { TourAddons } from './pages/admin/tours/TourAddons';
import { PaymentsRefunds } from './pages/admin/finance/PaymentsRefunds';
import { Invoices } from './pages/admin/finance/Invoices';
import { FinanceReports } from './pages/admin/finance/FinanceReports';
import { FortnoxIntegration } from './pages/admin/finance/FortnoxIntegration';
import { CompanySettings } from './pages/admin/settings/CompanySettings';
import { UserManagement } from './pages/admin/settings/UserManagement';
import { AdminUsersManager } from './pages/admin/settings/components/AdminUsersManager';
import { RolesPermissions } from './pages/admin/settings/RolesPermissions';
import { EmailSettings } from './pages/admin/settings/EmailSettings';
import { Logs } from './pages/admin/settings/components/Logs';
import { StripePaymentSettings } from './pages/admin/settings/StripeSettings';
import { MyPages } from './pages/MyPages';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './src/shared/context/ToastContext';
import { UserRole } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }: { children?: React.ReactNode, requiredRole?: UserRole }) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Don't redirect while checking auth state
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated && requiredRole) {
      // In a real app, redirect to login
      // For demo, we might show a message or redirect home
      return <Navigate to="/" />; 
  }

  // Allow all admin-level roles to access admin routes
  if (requiredRole === UserRole.ADMIN && !isAdmin) {
      return <Navigate to="/" />;
  }
  
  // For specific role requirements (non-admin routes)
  if (requiredRole && requiredRole !== UserRole.ADMIN && user?.role !== requiredRole) {
      return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes with regular Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/tour/:id" element={<Layout><TourDetails /></Layout>} />
            <Route path="/test" element={<Layout><TestPage /></Layout>} />
            <Route path="/book/:tourId" element={<Layout><BookingWizardWithStripe /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyPages /></Layout>} />

            {/* Admin Routes with AdminLayout */}
            <Route path="/admin" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><BookingManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><CustomerManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/waitlist" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><WaitlistManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/promocodes" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><PromoCodeManager /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Marketing Routes */}
            <Route path="/admin/marketing/promo-codes" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><PromoCodeManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/marketing/email-templates" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><EmailTemplates /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Customer Routes */}
            <Route path="/admin/customers/groups" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><CustomerGroups /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/customers/communications" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><CommunicationLogs /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Tour Routes */}
            <Route path="/admin/tours" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><TourManagement /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/tours/addons" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><TourAddons /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Finance Routes */}
            <Route path="/admin/finance/invoices" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><Invoices /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/finance/reports" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><FinanceReports /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/finance/fortnox" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><FortnoxIntegration /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Settings Routes */}
            <Route path="/admin/settings/company" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><CompanySettings /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings/users" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><AdminUsersManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings/roles" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><RolesPermissions /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings/email" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><EmailSettings /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings/payment" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><StripePaymentSettings /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/settings/logs" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><Logs /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
            <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
