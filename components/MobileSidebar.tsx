import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { AdminMenuItem, useAdminMenu } from './adminMenu';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { visibleCategories } = useAdminMenu();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    t('admin:bookings'),
    t('admin:marketing'),
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isCategoryActive = (items: AdminMenuItem[]) => {
    return items.some((item) => location.pathname === item.path);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-80 bg-white min-h-screen flex flex-col z-50 lg:hidden shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-purple-600">Swett Admin</h2>
            <p className="text-sm text-gray-500 mt-1">{t('admin:managementPortal')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Dashboard */}
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center gap-3 px-6 py-3 mb-2 transition-colors ${
              isActive('/admin')
                ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">{t('admin:dashboard')}</span>
          </Link>

          {/* Categories - filtered by user role */}
          {visibleCategories
            .map((category) => {
              const isExpanded = expandedCategories.includes(category.label);
              const hasActiveItem = isCategoryActive(category.items);

              return (
                <div key={category.label} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.label)}
                    className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                      hasActiveItem
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span className="font-medium">{category.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="bg-gray-50">
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-6 py-2.5 pl-12 transition-colors ${
                            isActive(item.path)
                              ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('admin:backToSite')}</span>
          </Link>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-700 font-medium">{t('admin:needHelp')}</p>
            <p className="text-xs text-gray-600 mt-1">
              {t('admin:helpText')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export { MobileSidebar };

// Export menu button for header
export const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label={t('admin:openMenu')}
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </button>
  );
};
