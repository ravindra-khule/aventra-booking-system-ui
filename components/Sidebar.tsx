import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Dashboard',
    'Bookings',
    'Marketing',
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

  // Menu structure with categories
  const menuCategories: MenuCategory[] = [
    {
      label: 'Bookings',
      icon: <Calendar className="w-5 h-5" />,
      items: [
        {
          label: 'All Bookings',
          path: '/admin/bookings',
          icon: <ListOrdered className="w-4 h-4" />,
        },
        {
          label: 'Booking Calendar',
          path: '/admin/bookings/calendar',
          icon: <CalendarClock className="w-4 h-4" />,
        },
        {
          label: 'Waitlist',
          path: '/admin/waitlist',
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'Marketing',
      icon: <TrendingUp className="w-5 h-5" />,
      items: [
        {
          label: 'Promo Codes',
          path: '/admin/marketing/promo-codes',
          icon: <Tag className="w-4 h-4" />,
        },
        {
          label: 'Email Templates',
          path: '/admin/marketing/email-templates',
          icon: <Mail className="w-4 h-4" />,
        },
        {
          label: 'Campaign Manager',
          path: '/admin/marketing/campaigns',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          label: 'Analytics',
          path: '/admin/marketing/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'Customers',
      icon: <Users className="w-5 h-5" />,
      items: [
        {
          label: 'Customer List',
          path: '/admin/customers',
          icon: <UsersRound className="w-4 h-4" />,
        },
        {
          label: 'Customer Groups',
          path: '/admin/customers/groups',
          icon: <Users className="w-4 h-4" />,
        },
        {
          label: 'Communication Logs',
          path: '/admin/customers/communications',
          icon: <MessageSquare className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'Tours',
      icon: <Map className="w-5 h-5" />,
      items: [
        {
          label: 'Tour Management',
          path: '/admin/tours',
          icon: <MapPin className="w-4 h-4" />,
        },
        {
          label: 'Pricing & Availability',
          path: '/admin/tours/pricing',
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: 'Itineraries',
          path: '/admin/tours/itineraries',
          icon: <Map className="w-4 h-4" />,
        },
        {
          label: 'Add-ons',
          path: '/admin/tours/addons',
          icon: <Package className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'Finance',
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        {
          label: 'Payments & Refunds',
          path: '/admin/finance/payments',
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          label: 'Invoices',
          path: '/admin/finance/invoices',
          icon: <Receipt className="w-4 h-4" />,
        },
        {
          label: 'Reports',
          path: '/admin/finance/reports',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: 'Fortnox Integration',
          path: '/admin/finance/fortnox',
          icon: <Building2 className="w-4 h-4" />,
        },
      ],
    },
    {
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          label: 'Company Info',
          path: '/admin/settings/company',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          label: 'User Management',
          path: '/admin/settings/users',
          icon: <UserCog className="w-4 h-4" />,
        },
        {
          label: 'Roles & Permissions',
          path: '/admin/settings/roles',
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: 'Email Settings',
          path: '/admin/settings/email',
          icon: <MailOpen className="w-4 h-4" />,
        },
        {
          label: 'System Logs',
          path: '/admin/settings/logs',
          icon: <FileBarChart className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-purple-600">Aventra Admin</h2>
        <p className="text-sm text-gray-500 mt-1">Management Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Dashboard - Always visible */}
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-6 py-3 mb-2 transition-colors ${
            isActive('/admin')
              ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Categories with submenus */}
        {menuCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.label);
          const hasActiveItem = isCategoryActive(category.items);

          return (
            <div key={category.label} className="mb-2">
              {/* Category Header */}
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

              {/* Submenu Items */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {category.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
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
          <p className="text-xs text-purple-700 font-medium">Need Help?</p>
          <p className="text-xs text-gray-600 mt-1">
            Check our documentation or contact support
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
