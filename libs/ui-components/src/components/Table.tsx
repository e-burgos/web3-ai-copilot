import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={twMerge(clsx('w-full border-collapse', className))}>{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={twMerge(clsx('border-b border-border', className))}>{children}</thead>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr
      className={twMerge(
        clsx(
          'border-b border-border/50 transition-colors',
          onClick && 'cursor-pointer hover:bg-muted/50',
          className
        )
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function TableCell({ children, className, align = 'left' }: TableCellProps) {
  return (
    <td
      className={twMerge(
        clsx('px-4 py-3', {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        }),
        className
      )}
    >
      {children}
    </td>
  );
}

