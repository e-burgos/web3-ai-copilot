import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DefiPositionItem } from '@web3-ai-copilot/data-hooks';
import {
  sortingCompareNumberFn,
  sortingCompareStringFn,
} from '@e-burgos/tucutable';
import {
  formatCurrency,
  formatPercentage,
} from '@web3-ai-copilot/shared-utils';

export const useDeFiTableColumns = () => {
  const columns: ColumnDef<DefiPositionItem, DefiPositionItem>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Position',
        footer: 'Position',
        accessorKey: 'name',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.name || '',
            rowB.original?.name || ''
          ),
        cell: (info) => {
          const position = info?.getValue();
          return (
            <div>
              <div className="font-medium">{position.name}</div>
              <div className="text-sm text-muted-foreground">
                {position.tokenName} ({position.tokenSymbol})
              </div>
            </div>
          );
        },
      },
      {
        id: 'protocol',
        header: 'Protocol',
        footer: 'Protocol',
        accessorKey: 'protocol',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.protocol || '',
            rowB.original?.protocol || ''
          ),
        cell: (info) => {
          const position = info?.getValue();
          return (
            <div className="font-medium capitalize">{position.protocol}</div>
          );
        },
      },
      {
        id: 'type',
        header: 'Type',
        footer: 'Type',
        accessorKey: 'type',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.type || '',
            rowB.original?.type || ''
          ),
        cell: (info) => {
          const position = info?.getValue();
          return (
            <div className="text-brand font-medium capitalize">
              {position.type}
            </div>
          );
        },
      },
      {
        id: 'value',
        header: 'Value (USD)',
        footer: 'Value (USD)',
        accessorKey: 'value',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.value || 0,
            rowB.original?.value || 0
          ),
        cell: (info) => {
          const position = info?.getValue();
          return (
            <div className="font-medium">{formatCurrency(position.value)}</div>
          );
        },
      },
      {
        id: 'price',
        header: 'Price (USD)',
        footer: 'Price (USD)',
        accessorKey: 'price',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.price || 0,
            rowB.original?.price || 0
          ),
        cell: (info) => {
          const position = info?.getValue();
          return (
            <div className="font-medium">{formatCurrency(position.price)}</div>
          );
        },
      },
      {
        id: 'apy',
        header: 'APY',
        footer: 'APY',
        accessorKey: 'apy',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.apy || 0,
            rowB.original?.apy || 0
          ),
        cell: (info) => {
          const position = info?.getValue();
          if (!position.apy || position.apy === 0) {
            return <div className="text-muted-foreground">-</div>;
          }
          return (
            <div className="font-medium text-green-500">
              {formatPercentage(position.apy)}
            </div>
          );
        },
      },
      {
        id: 'priceChange24h',
        header: '24h Change',
        footer: '24h Change',
        accessorKey: 'priceChange24h',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.priceChange24h || 0,
            rowB.original?.priceChange24h || 0
          ),
        cell: (info) => {
          const position = info?.getValue();
          if (
            position.priceChange24h === undefined ||
            position.priceChange24h === null
          ) {
            return <div className="text-muted-foreground">-</div>;
          }
          return (
            <div
              className={
                position.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              {formatPercentage(position.priceChange24h)}
            </div>
          );
        },
      },
    ],
    []
  );
  return { columns: columns || [] };
};

export default useDeFiTableColumns;
