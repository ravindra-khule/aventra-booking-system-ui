import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Calendar, Users, Map, Globe } from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Quick helper to switch roles for demo purposes
  const handleRoleSwitch = async () => {
    if (user?.role === UserRole.ADMIN) {
      logout();
    } else {
      await login('admin@aventra.com', UserRole.ADMIN);
      navigate('/admin');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">AVEN<span className="text-blue-600">TRA</span></span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  {t('nav.tours')}
                </Link>
                {user?.role === UserRole.CUSTOMER && (
                   <Link to="/my-bookings" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                     {t('nav.myPages')}
                   </Link>
                )}
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
               {/* Language Toggle */}
               <button 
                 onClick={toggleLanguage}
                 className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium"
               >
                 <Globe className="h-4 w-4 mr-1" />
                 {language === 'en' ? 'SV' : 'EN'}
               </button>

               {/* Demo Toggle */}
               <button 
                onClick={handleRoleSwitch}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition"
               >
                 {user?.role === UserRole.ADMIN ? t('nav.switchGuest') : t('nav.switchAdmin')}
               </button>

               {user ? (
                 <div className="flex items-center space-x-3">
                   <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500">{t('nav.loggedInAs')} {user.role}</span>
                   </div>
                   <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                     <LogOut className="h-5 w-5" />
                   </button>
                 </div>
               ) : (
                 <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                   {t('nav.signIn')}
                 </Link>
               )}
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                {t('nav.tours')}
              </Link>
              {user?.role === UserRole.CUSTOMER && (
                <Link to="/my-bookings" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  {t('nav.myPages')}
                </Link>
              )}
              <button onClick={toggleLanguage} className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                 {language === 'en' ? 'Byt till Svenska' : 'Switch to English'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AVENTRA</h3>
              <p className="text-gray-400 text-sm">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.faq')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.cancelPolicy')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.secure')}</h4>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Stripe</span>
                <span>•</span>
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Aventra AB. {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
};