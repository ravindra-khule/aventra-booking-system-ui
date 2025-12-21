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
    <div className="min-h-screen flex bg-gray-50">
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left Side - Mobile Menu & Breadcrumb */}
              <div className="flex items-center gap-4">
                <MenuButton onClick={() => setIsMobileMenuOpen(true)} />
                
                {/* Logo - visible on mobile when sidebar is hidden */}
                <div className="lg:hidden">
                  <span className="text-xl font-bold text-purple-600">Swett</span>
                </div>
              </div>

              {/* Right Side - User Actions */}
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={language === 'en' ? 'Switch to Swedish' : 'Switch to English'}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'SV'}</span>
                </button>

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="hidden md:flex flex-col text-right">
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                    
                    {/* User Avatar */}
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-purple-600" />
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
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
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
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
