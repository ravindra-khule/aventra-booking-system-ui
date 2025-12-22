import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Menu, X, User as UserIcon, LogOut, Globe } from 'lucide-react';
import { DemoLoginModal } from './DemoLoginModal';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    try {
      await login(email, role, password);
      
      // Close the modal first
      setShowLoginModal(false);
      
      // Navigate based on role after successful login
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        if (role === UserRole.CUSTOMER || role === UserRole.GUEST) {
          navigate('/');
        } else {
          // Super Admin, Admin, Support, Accountant, Developer go to admin dashboard
          navigate('/admin');
        }
      }, 100);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let DemoLoginModal handle the error
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff' }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-2xl font-bold tracking-tight" style={{ color: '#000' }}>SWE<span style={{ color: '#ff1b00' }}>TT</span></span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" style={{ color: '#6b7280' }}>
                  {t('nav.tours')}
                </Link>
                {user?.role === UserRole.CUSTOMER && (
                   <Link to="/my-bookings" className="border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" style={{ color: '#6b7280' }}>
                     {t('nav.myPages')}
                   </Link>
                )}
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
               {/* Language Toggle */}
               <button 
                 onClick={toggleLanguage}
                 className="btn btn-secondary-dark btn-sm"
                 title={language === 'en' ? 'Switch to Swedish' : 'Switch to English'}
               >
                 <Globe className="h-4 w-4" />
                 <span className="font-semibold">{language === 'en' ? 'EN' : 'SV'}</span>
               </button>

               {user ? (
                 <div className="flex items-center space-x-3">
                   <div className="flex flex-col text-right">
                      <span className="text-sm font-medium" style={{ color: '#000' }}>{user.name}</span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>{t('nav.loggedInAs')} {user.role}</span>
                   </div>
                   <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100" style={{ color: '#6b7280' }}>
                     <LogOut className="h-5 w-5" />
                   </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setShowLoginModal(true)}
                   className="btn btn-primary btn-md"
                 >
                   {t('nav.signIn')}
                 </button>
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
              <Link to="/" className="border-l-4 block pl-3 pr-4 py-2 text-base font-medium" style={{ backgroundColor: '#fff1ed', borderColor: '#ff1b00', color: '#ff1b00' }}>
                {t('nav.tours')}
              </Link>
              {user?.role === UserRole.CUSTOMER && (
                <Link to="/my-bookings" className="border-transparent border-l-4 block pl-3 pr-4 py-2 text-base font-medium hover:bg-gray-50" style={{ color: '#6b7280' }}>
                  {t('nav.myPages')}
                </Link>
              )}
              <button 
                onClick={toggleLanguage} 
                className="w-full text-left border-transparent border-l-4 block pl-3 pr-4 py-2 text-base font-medium flex items-center gap-2 hover:bg-gray-50"
                style={{ color: '#6b7280' }}
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Svenska (SV)' : 'English (EN)'}
              </button>
              {!user && (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="w-full text-left border-transparent border-l-4 block pl-3 pr-4 py-2 text-base font-medium flex items-center gap-2 hover:bg-gray-50"
                  style={{ color: '#6b7280' }}
                >
                  <UserIcon className="h-4 w-4" />
                  {t('nav.signIn')}
                </button>
              )}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full text-left border-l-4 border-transparent block pl-3 pr-4 py-2 text-base font-medium flex items-center gap-2"
                  style={{ color: '#dc2626' }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout ({user.name})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Demo Login Modal */}
      <DemoLoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <main className="flex-1">
        {children}
      </main>

      <footer style={{ backgroundColor: '#000', color: '#fff' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SWETT</h3>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#9ca3af' }}>
                <li><a href="#" className="hover:text-white">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.faq')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.cancelPolicy')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.secure')}</h4>
              <div className="flex items-center space-x-2 text-sm" style={{ color: '#9ca3af' }}>
                <span>Stripe</span>
                <span>•</span>
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm" style={{ borderColor: '#374151', color: '#9ca3af' }}>
            &copy; {new Date().getFullYear()} Swett AB. {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
};