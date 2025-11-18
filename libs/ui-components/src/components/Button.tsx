import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            {
              'bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary':
                variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary':
                variant === 'secondary',
              'hover:bg-accent hover:text-accent-foreground focus:ring-accent':
                variant === 'ghost',
            },
            {
              'px-3 py-1.5 text-sm': size === 'sm',
              'px-4 py-2 text-base': size === 'md',
              'px-6 py-3 text-lg': size === 'lg',
            },
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

