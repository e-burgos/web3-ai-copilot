import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-muted rounded',
          {
            'h-4 w-full': variant === 'text',
            'h-12 w-12 rounded-full': variant === 'circular',
            'h-24 w-full': variant === 'rectangular',
          },
          className
        )
      )}
      {...props}
    />
  );
}

