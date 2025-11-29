import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 * 
 * Reusable input field with label, error states, and icons
 * 
 * @example
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   placeholder="Enter your email"
 *   error={errors.email}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const paddingClass = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    return (
      <div className={widthClass}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-lg border ${errorClass} ${paddingClass} px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
