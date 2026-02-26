import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Map,
  DollarSign,
  Settings,
  Tag,
  Mail,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  CalendarClock,
  Clock,
  UsersRound,
  MessageSquare,
  MapPin,
  Package,
  Receipt,
  FileText,
  BarChart3,
  Building2,
  UserCog,
  Shield,
  MailOpen,
  FileBarChart,
  CreditCard,
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface MenuCategory {
  label: string;
  icon: React.ReactNode;
  items: MenuItem[];
  allowedRoles?: UserRole[]; // Which roles can see this category
}

// Helper function to check if user has access to a category
const hasAccessToCategory = (category: MenuCategory, userRole: UserRole | undefined): boolean => {
  if (!userRole) return false;
  if (!category.allowedRoles || category.allowedRoles.length === 0) return true; // If no restriction, allow all
  return category.allowedRoles.includes(userRole);
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth(); // Get current user to check role
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

  const isCategoryActive = (items: MenuItem[]) => {
    return items.some((item) => location.pathname === item.path);
  };

  // Menu structure with categories - now using translations
  // This is recreated on every render to ensure translations are updated
  // Role-based tab visibility:
  // - Super Admin: All tabs
  // - Admin: All tabs (Bookings, Marketing, Customers, Tours, Finance, Settings)
  // - Manager (Accountant): Bookings, Customers, Finance, Tours
  // - Support: Bookings, Customers only
  const menuCategories: MenuCategory[] = [
    {
      label: t('admin:bookings'),
      icon: <Calendar className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.SUPPORT],
      items: [
        {
          label: t('admin:allBookings'),
          path: '/admin/bookings',
          icon: <ListOrdered className="w-4 h-4" />,
        },
        {
          label: t('admin:waitlist'),
          path: '/admin/waitlist',
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin:marketing'),
      icon: <TrendingUp className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN], // Admin only
      items: [
        {
          label: t('admin:promoCodes'),
          path: '/admin/marketing/promo-codes',
          icon: <Tag className="w-4 h-4" />,
        },
        {
          label: t('admin:emailTemplates'),
          path: '/admin/marketing/email-templates',
          icon: <Mail className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin:customers'),
      icon: <Users className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.SUPPORT],
      items: [
        {
          label: t('admin:customerList'),
          path: '/admin/customers',
          icon: <UsersRound className="w-4 h-4" />,
        },
        {
          label: t('admin:customerGroups'),
          path: '/admin/customers/groups',
          icon: <Users className="w-4 h-4" />,
        },
        {
          label: t('admin:communicationLogs'),
          path: '/admin/customers/communications',
          icon: <MessageSquare className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin:tours'),
      icon: <Map className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT], // Admin and Manager only
      items: [
        {
          label: t('admin:tourManagement'),
          path: '/admin/tours',
          icon: <MapPin className="w-4 h-4" />,
        },
        {
          label: t('admin:addons'),
          path: '/admin/tours/addons',
          icon: <Package className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin:finance'),
      icon: <DollarSign className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT], // Admin and Manager only
      items: [
        {
          label: t('admin:invoices'),
          path: '/admin/finance/invoices',
          icon: <Receipt className="w-4 h-4" />,
        },
        {
          label: t('admin:reports'),
          path: '/admin/finance/reports',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: t('admin:fortnoxIntegration'),
          path: '/admin/finance/fortnox',
          icon: <Building2 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin:settings'),
      icon: <Settings className="w-5 h-5" />,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN], // Admin only
      items: [
        {
          label: t('admin:companyInfo'),
          path: '/admin/settings/company',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          label: t('admin:userManagement'),
          path: '/admin/settings/users',
          icon: <UserCog className="w-4 h-4" />,
        },
        {
          label: t('admin:rolesPermissions'),
          path: '/admin/settings/roles',
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: t('admin:emailSettings'),
          path: '/admin/settings/email',
          icon: <MailOpen className="w-4 h-4" />,
        },
        {
          label: t('admin:paymentDetails'),
          path: '/admin/settings/payment',
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          label: t('admin:systemLogs'),
          path: '/admin/settings/logs',
          icon: <FileBarChart className="w-4 h-4" />,
        },
      ],
    },
  ];

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
        {menuCategories
          .filter((category) => hasAccessToCategory(category, user?.role))
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
