import React, { useMemo } from 'react';
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
  ListOrdered,
  Clock,
  UsersRound,
  MessageSquare,
  MapPin,
  Package,
  Receipt,
  FileText,
  Building2,
  UserCog,
  Shield,
  MailOpen,
  FileBarChart,
  CreditCard,
} from 'lucide-react';

export interface AdminMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  keywords?: string[]; // Extra search terms (e.g. English aliases when UI is Swedish)
}

export interface AdminMenuCategory {
  label: string;
  icon: React.ReactNode;
  items: AdminMenuItem[];
  allowedRoles?: UserRole[]; // Which roles can see this category
}

// Helper function to check if user has access to a category
export const hasAccessToCategory = (category: AdminMenuCategory, userRole: UserRole | undefined): boolean => {
  if (!userRole) return false;
  if (!category.allowedRoles || category.allowedRoles.length === 0) return true; // If no restriction, allow all
  return category.allowedRoles.includes(userRole);
};

// Shared admin navigation structure used by the sidebars and the header search.
// Role-based tab visibility:
// - Super Admin: All tabs
// - Admin: All tabs (Bookings, Marketing, Customers, Tours, Finance, Settings)
// - Manager (Accountant): Bookings, Customers, Finance, Tours
// - Support: Bookings, Customers only
export const useAdminMenu = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const dashboardItem = useMemo<AdminMenuItem>(
    () => ({
      label: t('admin:dashboard'),
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      keywords: ['dashboard', 'overview', 'home', 'instrumentpanel'],
    }),
    [t, i18n.language]
  );

  const menuCategories = useMemo<AdminMenuCategory[]>(
    () => [
      {
        label: t('admin:bookings'),
        icon: <Calendar className="w-5 h-5" />,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.SUPPORT],
        items: [
          {
            label: t('admin:allBookings'),
            path: '/admin/bookings',
            icon: <ListOrdered className="w-4 h-4" />,
            keywords: ['bookings', 'all bookings', 'bokningar'],
          },
          {
            label: t('admin:waitlist'),
            path: '/admin/waitlist',
            icon: <Clock className="w-4 h-4" />,
            keywords: ['waitlist', 'queue', 'väntelista'],
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
            keywords: ['promo', 'promo codes', 'discount', 'kampanjkoder', 'rabatt'],
          },
          {
            label: t('admin:emailTemplates'),
            path: '/admin/marketing/email-templates',
            icon: <Mail className="w-4 h-4" />,
            keywords: ['email', 'templates', 'mail', 'e-post', 'mallar'],
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
            keywords: ['customers', 'customer list', 'kunder', 'kundlista'],
          },
          {
            label: t('admin:customerGroups'),
            path: '/admin/customers/groups',
            icon: <Users className="w-4 h-4" />,
            keywords: ['groups', 'segments', 'kundgrupper'],
          },
          {
            label: t('admin:communicationLogs'),
            path: '/admin/customers/communications',
            icon: <MessageSquare className="w-4 h-4" />,
            keywords: ['communications', 'logs', 'messages', 'kommunikationsloggar'],
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
            keywords: ['tours', 'tour management', 'turer', 'turhantering'],
          },
          {
            label: t('admin:addons'),
            path: '/admin/tours/addons',
            icon: <Package className="w-4 h-4" />,
            keywords: ['addons', 'add-ons', 'extras', 'tillägg'],
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
            keywords: ['invoices', 'billing', 'fakturor'],
          },
          {
            label: t('admin:reports'),
            path: '/admin/finance/reports',
            icon: <FileText className="w-4 h-4" />,
            keywords: ['reports', 'analytics', 'rapporter'],
          },
          {
            label: t('admin:fortnoxIntegration'),
            path: '/admin/finance/fortnox',
            icon: <Building2 className="w-4 h-4" />,
            keywords: ['fortnox', 'integration', 'accounting', 'bokföring'],
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
            keywords: ['company', 'info', 'företagsinformation'],
          },
          {
            label: t('admin:userManagement'),
            path: '/admin/settings/users',
            icon: <UserCog className="w-4 h-4" />,
            keywords: ['users', 'user management', 'användarhantering'],
          },
          {
            label: t('admin:rolesPermissions'),
            path: '/admin/settings/roles',
            icon: <Shield className="w-4 h-4" />,
            keywords: ['roles', 'permissions', 'roller', 'behörigheter'],
          },
          {
            label: t('admin:emailSettings'),
            path: '/admin/settings/email',
            icon: <MailOpen className="w-4 h-4" />,
            keywords: ['email settings', 'e-postinställningar'],
          },
          {
            label: t('admin:paymentDetails'),
            path: '/admin/settings/payment',
            icon: <CreditCard className="w-4 h-4" />,
            keywords: ['payment', 'stripe', 'betalningsuppgifter'],
          },
          {
            label: t('admin:systemLogs'),
            path: '/admin/settings/logs',
            icon: <FileBarChart className="w-4 h-4" />,
            keywords: ['system', 'logs', 'systemloggar'],
          },
        ],
      },
    ],
    [t, i18n.language]
  );

  const visibleCategories = useMemo(
    () => menuCategories.filter((category) => hasAccessToCategory(category, user?.role)),
    [menuCategories, user?.role]
  );

  return { dashboardItem, menuCategories, visibleCategories };
};
