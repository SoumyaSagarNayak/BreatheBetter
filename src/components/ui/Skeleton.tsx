import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-forest-800/60 dark:bg-forest-800/60 theme-cream:bg-editorial-surface-card rounded-md ${className}`}
    />
  );
};

