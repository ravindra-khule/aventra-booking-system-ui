import React from 'react';

export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info'
  | 'purple'
  | 'gray';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

/**
 * Badge Component
 * 
 * Display status indicators, tags, or labels with different colors
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false,
}) => {
  const variantClasses = badgeVariants[variant];
  const sizeClasses = badgeSizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variantClasses} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
};
