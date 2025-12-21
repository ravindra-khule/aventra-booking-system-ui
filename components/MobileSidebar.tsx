import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import {
  Menu,
  X,
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
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    t('admin.bookings'),
    t('admin.marketing'),
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

  const menuCategories: MenuCategory[] = [
    {
      label: t('admin.bookings'),
      icon: <Calendar className="w-5 h-5" />,
      items: [
        {
          label: t('admin.allBookings'),
          path: '/admin/bookings',
          icon: <ListOrdered className="w-4 h-4" />,
        },
        {
          label: t('admin.bookingCalendar'),
          path: '/admin/bookings/calendar',
          icon: <CalendarClock className="w-4 h-4" />,
        },
        {
          label: t('admin.waitlist'),
          path: '/admin/waitlist',
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin.marketing'),
      icon: <TrendingUp className="w-5 h-5" />,
      items: [
        {
          label: t('admin.promoCodes'),
          path: '/admin/marketing/promo-codes',
          icon: <Tag className="w-4 h-4" />,
        },
        {
          label: t('admin.emailTemplates'),
          path: '/admin/marketing/email-templates',
          icon: <Mail className="w-4 h-4" />,
        },
        {
          label: t('admin.campaignManager'),
          path: '/admin/marketing/campaigns',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          label: t('admin.analytics'),
          path: '/admin/marketing/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin.customers'),
      icon: <Users className="w-5 h-5" />,
      items: [
        {
          label: t('admin.customerList'),
          path: '/admin/customers',
          icon: <UsersRound className="w-4 h-4" />,
        },
        {
          label: t('admin.customerGroups'),
          path: '/admin/customers/groups',
          icon: <Users className="w-4 h-4" />,
        },
        {
          label: t('admin.communicationLogs'),
          path: '/admin/customers/communications',
          icon: <MessageSquare className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin.tours'),
      icon: <Map className="w-5 h-5" />,
      items: [
        {
          label: t('admin.tourManagement'),
          path: '/admin/tours',
          icon: <MapPin className="w-4 h-4" />,
        },
        {
          label: t('admin.pricingAvailability'),
          path: '/admin/tours/pricing',
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: t('admin.itineraries'),
          path: '/admin/tours/itineraries',
          icon: <Map className="w-4 h-4" />,
        },
        {
          label: t('admin.addons'),
          path: '/admin/tours/addons',
          icon: <Package className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin.finance'),
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        {
          label: t('admin.paymentsRefunds'),
          path: '/admin/finance/payments',
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: t('admin.invoices'),
          path: '/admin/finance/invoices',
          icon: <Receipt className="w-4 h-4" />,
        },
        {
          label: t('admin.reports'),
          path: '/admin/finance/reports',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: t('admin.fortnoxIntegration'),
          path: '/admin/finance/fortnox',
          icon: <Building2 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: t('admin.settings'),
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          label: t('admin.companyInfo'),
          path: '/admin/settings/company',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          label: t('admin.userManagement'),
          path: '/admin/settings/users',
          icon: <UserCog className="w-4 h-4" />,
        },
        {
          label: t('admin.rolesPermissions'),
          path: '/admin/settings/roles',
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: t('admin.emailSettings'),
          path: '/admin/settings/email',
          icon: <MailOpen className="w-4 h-4" />,
        },
        {
          label: t('admin.systemLogs'),
          path: '/admin/settings/logs',
          icon: <FileBarChart className="w-4 h-4" />,
        },
      ],
    },
  ];

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
            <p className="text-sm text-gray-500 mt-1">{t('admin.managementPortal')}</p>
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
            <span className="font-medium">{t('admin.dashboard')}</span>
          </Link>

          {/* Categories */}
          {menuCategories.map((category) => {
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
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-700 font-medium">{t('admin.needHelp')}</p>
            <p className="text-xs text-gray-600 mt-1">
              {t('admin.helpText')}
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
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </button>
  );
};
