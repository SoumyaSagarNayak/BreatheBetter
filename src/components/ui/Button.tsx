import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'coral' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-500/50 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-sm h-8 gap-1.5',
    md: 'text-sm px-4 py-2 rounded-md h-10 gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg h-12 gap-2.5',
    icon: 'h-10 w-10 rounded-md p-0 flex items-center justify-center',
  };

  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm border border-emerald-500/20',
    coral:
      'bg-editorial-primary hover:bg-editorial-primary-active active:bg-editorial-primary-active text-white shadow-sm',
    secondary:
      'bg-forest-900/80 hover:bg-forest-800 text-slate-200 border border-forest-700/60 dark:bg-forest-900/80 dark:hover:bg-forest-800 dark:border-forest-700/60 theme-cream:bg-editorial-surface-card theme-cream:hover:bg-editorial-surface-cream-strong theme-cream:text-editorial-ink theme-cream:border-editorial-hairline',
    outline:
      'bg-transparent hover:bg-forest-850/60 text-slate-300 border border-forest-700/50 dark:hover:bg-forest-850/60 dark:border-forest-700/50 theme-cream:hover:bg-editorial-surface-soft theme-cream:text-editorial-ink theme-cream:border-editorial-hairline',
    ghost:
      'bg-transparent hover:bg-forest-800/50 text-slate-300 hover:text-white dark:hover:bg-forest-800/50 theme-cream:hover:bg-editorial-surface-card theme-cream:text-editorial-body',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : null}
      {children}
    </button>
  );
};

