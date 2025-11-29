import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

/**
 * Card Component
 * 
 * Container component with consistent styling for content sections
 * 
 * @example
 * <Card padding="md" shadow="sm">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200';
  const paddingClass = paddingClasses[padding];
  const shadowClass = shadowClasses[shadow];
  const hoverClass = hover ? 'transition-all hover:shadow-lg cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${shadowClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-bold text-gray-900 ${className}`}>{children}</h3>;
};

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>;
};
