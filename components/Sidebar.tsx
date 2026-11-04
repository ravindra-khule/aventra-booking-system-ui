import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { AdminMenuItem, useAdminMenu } from './adminMenu';

const Sidebar: React.FC = () => {
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

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col" style={{ borderColor: '#e5e7eb' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
        <h2 className="text-xl font-bold" style={{ color: '#ff1b00' }}>Swett Admin</h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{t('admin:managementPortal')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Dashboard - Always visible */}
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-6 py-3 mb-2 transition-colors ${
            isActive('/admin')
              ? 'border-r-4'
              : ''
          }`}
          style={
            isActive('/admin')
              ? { backgroundColor: '#fff1ed', color: '#ff1b00', borderColor: '#ff1b00' }
              : { color: '#374151' }
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">{t('admin:dashboard')}</span>
        </Link>

        {/* Categories with submenus - filtered by user role */}
        {visibleCategories
          .map((category) => {
            const isExpanded = expandedCategories.includes(category.label);
            const hasActiveItem = isCategoryActive(category.items);

            return (
              <div key={category.label} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.label)}
                className="w-full flex items-center justify-between px-6 py-3 transition-colors"
                style={
                  hasActiveItem
                    ? { backgroundColor: '#fff1ed', color: '#ff1b00' }
                    : { color: '#374151' }
                }
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

              {/* Submenu Items */}
              {isExpanded && (
                <div style={{ backgroundColor: '#f9fafb' }}>
                  {category.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-6 py-2.5 pl-12 transition-colors ${
                        isActive(item.path)
                          ? 'border-r-4'
                          : ''
                      }`}
                      style={
                        isActive(item.path)
                          ? { backgroundColor: '#ffe5df', color: '#ff1b00', borderColor: '#ff1b00' }
                          : { color: '#6b7280' }
                      }
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
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
      <div className="p-4 border-t" style={{ borderColor: '#e5e7eb' }}>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: '#374151' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">{t('admin:backToSite')}</span>
        </Link>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#fff1ed' }}>
          <p className="text-xs font-medium" style={{ color: '#ff1b00' }}>{t('admin:needHelp')}</p>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
            {t('admin:helpText')}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
