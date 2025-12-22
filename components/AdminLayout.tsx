import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { UserRole } from '../types';
import { LogOut, Globe, User as UserIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import { MobileSidebar, MenuButton } from './MobileSidebar';

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    await login(email, role, password);
    
    // Navigate based on role
    if (role === UserRole.CUSTOMER || role === UserRole.GUEST) {
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f4e6d3' }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-30" style={{ borderColor: '#e5e7eb' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left Side - Mobile Menu & Breadcrumb */}
              <div className="flex items-center gap-4">
                <MenuButton onClick={() => setIsMobileMenuOpen(true)} />
                
                {/* Logo - visible on mobile when sidebar is hidden */}
                <div className="lg:hidden">
                  <span className="text-xl font-bold" style={{ color: '#ff1b00' }}>Swett</span>
                </div>
              </div>

              {/* Right Side - User Actions */}
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="btn btn-secondary-dark btn-sm"
                  title={language === 'en' ? 'Switch to Swedish' : 'Switch to English'}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'SV'}</span>
                </button>

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: '#e5e7eb' }}>
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-sm font-medium" style={{ color: '#000' }}>{user.name}</span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>{user.role}</span>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff1ed' }}>
                      <UserIcon className="w-4 h-4" style={{ color: '#ff1b00' }} />
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: '#6b7280' }}
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4" style={{ borderColor: '#e5e7eb' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm" style={{ color: '#6b7280' }}>
              <div className="mb-2 sm:mb-0">
                &copy; {new Date().getFullYear()} Swett AB. All rights reserved.
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Documentation</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
