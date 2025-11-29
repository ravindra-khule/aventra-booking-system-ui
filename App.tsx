import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TourDetails } from './pages/TourDetails';
import { BookingWizard } from './pages/booking/BookingWizard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BookingManager } from './pages/admin/BookingManager';
import { CustomerManager } from './pages/admin/CustomerManager';
import { WaitlistManager } from './pages/admin/WaitlistManager';
import { PromoCodeManager } from './pages/admin/PromoCodeManager';
import { MyPages } from './pages/MyPages';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
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
        <Layout>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/tour/:id" element={<TourDetails />} />
                <Route path="/book/:tourId" element={<BookingWizard />} />
                
                {/* Customer Portal (Mock) */}
                <Route path="/my-pages" element={<MyPages />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/bookings" element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <BookingManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/customers" element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <CustomerManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/waitlist" element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <WaitlistManager />
                    </ProtectedRoute>
                } />
                <Route path="/admin/promocodes" element={
                    <ProtectedRoute requiredRole={UserRole.ADMIN}>
                        <PromoCodeManager />
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
            <AppRoutes />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
