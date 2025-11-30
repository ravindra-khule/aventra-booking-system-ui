import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { TourDetails } from './pages/TourDetails';
import { BookingWizard } from './pages/booking/BookingWizard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BookingManager } from './pages/admin/BookingManager';
import { CustomerManager } from './pages/admin/CustomerManager';
import { WaitlistManager } from './pages/admin/WaitlistManager';
import { PromoCodeManager } from './pages/admin/PromoCodeManager';
import { EmailTemplates } from './pages/admin/marketing/EmailTemplates';
import { CampaignManager } from './pages/admin/marketing/CampaignManager';
import { MarketingAnalytics } from './pages/admin/marketing/MarketingAnalytics';
import { BookingCalendar } from './pages/admin/bookings/BookingCalendar';
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
import { RolesPermissions } from './pages/admin/settings/RolesPermissions';
import { EmailSettings } from './pages/admin/settings/EmailSettings';
import { SystemLogs } from './pages/admin/settings/SystemLogs';
import { MyPages } from './pages/MyPages';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './src/shared/context/ToastContext';
import { UserRole } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }: { children?: React.ReactNode, requiredRole?: UserRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated && requiredRole) {
      // In a real app, redirect to login
      // For demo, we might show a message or redirect home
      return <Navigate to="/" />; 
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== UserRole.SUPPORT) {
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
            <Route path="/book/:tourId" element={<Layout><BookingWizard /></Layout>} />
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
            
            {/* Booking Routes */}
            <Route path="/admin/bookings/calendar" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><BookingCalendar /></AdminLayout>
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
            <Route path="/admin/marketing/campaigns" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><CampaignManager /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/marketing/analytics" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><MarketingAnalytics /></AdminLayout>
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
            <Route path="/admin/tours/pricing" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><PricingAvailability /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/tours/itineraries" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><Itineraries /></AdminLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/tours/addons" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><TourAddons /></AdminLayout>
                </ProtectedRoute>
            } />

            {/* Finance Routes */}
            <Route path="/admin/finance/payments" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><PaymentsRefunds /></AdminLayout>
                </ProtectedRoute>
            } />
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
                    <AdminLayout><UserManagement /></AdminLayout>
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
            <Route path="/admin/settings/logs" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <AdminLayout><SystemLogs /></AdminLayout>
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
      <LanguageProvider>
        <ToastProvider>
          <Router>
              <AppRoutes />
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
