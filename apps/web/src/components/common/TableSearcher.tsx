import React, { useCallback } from 'react';
import { Button, Input, LucideIcons, useTheme } from '@e-burgos/tucu-ui';

interface TableSearcherProps {
  placeholder: string;
  search: string;
  icon?: React.ReactNode;
  className?: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

const TableSearcher: React.FC<TableSearcherProps> = ({
  placeholder,
  search,
  icon = <LucideIcons.Search className="h-4 w-4" />,
  className = 'w-full',
  setSearch,
  onClear,
  showClearButton = true,
}) => {
  const { mode } = useTheme();
  const onHandleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  return (
    <div className="flex w-full max-w-md gap-2 justify-start items-center relative">
      <Input
        placeholder={placeholder}
        className={className || 'w-full'}
        value={search}
        type="text"
        icon={icon || <LucideIcons.Search className="h-4 w-4" />}
        onChange={onHandleChange}
        inputClassName={`${mode === 'dark' ? 'text-gray-200!' : 'text-gray-800!'}`}
      />
      {showClearButton && (
        <Button
          variant="solid"
          shape="circle"
          size="tiny"
          onClick={() => {
            setSearch('');
            onClear?.();
          }}
          disabled={!search}
          className="absolute right-0 bottom-[5px]"
        >
          <LucideIcons.X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TableSearcher;
