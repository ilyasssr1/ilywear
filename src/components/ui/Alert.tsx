'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  closeable?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    text: 'text-green-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    text: 'text-red-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    text: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-700',
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  closeable,
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const colors = colorMap[variant];
  const Icon = iconMap[variant];

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={clsx(
        'rounded-lg border-2 p-4 flex gap-4 items-start',
        colors.bg,
        colors.border
      )}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', colors.icon)} />
      
      <div className="flex-1">
        {title && (
          <h3 className={clsx('font-bold text-sm mb-1', colors.title)}>
            {title}
          </h3>
        )}
        <p className={clsx('text-sm', colors.text)}>{message}</p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {action && (
          <button
            onClick={action.onClick}
            className={clsx(
              'text-sm font-bold px-3 py-1 rounded transition-colors',
              colors.text,
              'hover:opacity-80'
            )}
          >
            {action.label}
          </button>
        )}
        
        {closeable && (
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/30 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  size = 'md',
}) => {
  const variantMap = {
    primary: 'bg-black text-white',
    secondary: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-bold',
        variantMap[variant],
        sizeMap[size]
      )}
    >
      {children}
    </span>
  );
};
