import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TourDetails } from './pages/TourDetails';
import { BookingWizard } from './pages/booking/BookingWizard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BookingManager } from './pages/admin/BookingManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
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

// Component wrapper for My Pages to use hook
const MyPages = () => {
    const { t } = useTranslation();
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold">{t('myPages.title')}</h1>
            <p className="text-gray-600 mt-2">{t('myPages.welcome')}</p>
            <div className="mt-8 bg-white p-6 rounded shadow max-w-2xl mx-auto">
                <h2 className="text-lg font-bold mb-4">{t('myPages.upcoming')}</h2>
                <p className="text-gray-400">{t('myPages.noTrips')}</p>
            </div>
        </div>
    );
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
