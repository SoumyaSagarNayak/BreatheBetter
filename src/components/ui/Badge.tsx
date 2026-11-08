import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous' | 'default' | 'coral' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-pill font-medium gap-1',
    md: 'text-xs px-2.5 py-1 rounded-pill font-medium gap-1.5',
  };

  const variantStyles = {
    good: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    moderate: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    sensitive: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    unhealthy: 'bg-red-500/15 text-red-400 border border-red-500/30',
    veryUnhealthy: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    hazardous: 'bg-rose-950/40 text-rose-400 border border-rose-700/50',
    coral: 'bg-editorial-primary/15 text-editorial-primary border border-editorial-primary/30',
    default: 'bg-forest-800/80 text-mint-300 border border-forest-700/60 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-body-strong theme-cream:border-editorial-hairline',
    neutral: 'bg-slate-800/60 text-slate-300 border border-slate-700/50 theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-muted theme-cream:border-editorial-hairline',
  };

  const dotColors = {
    good: 'bg-emerald-400',
    moderate: 'bg-amber-400',
    sensitive: 'bg-orange-400',
    unhealthy: 'bg-red-400',
    veryUnhealthy: 'bg-purple-400',
    hazardous: 'bg-rose-400',
    coral: 'bg-editorial-primary',
    default: 'bg-mint-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center justify-center tracking-tight transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

