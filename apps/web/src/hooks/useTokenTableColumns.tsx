import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LucideIcons, Typography } from '@e-burgos/tucu-ui';
import { TokenItem } from '@web3-ai-copilot/data-hooks';
import {
  sortingCompareNumberFn,
  sortingCompareStringFn,
} from '@e-burgos/tucutable';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@web3-ai-copilot/shared-utils';
import {
  generateSparklineData,
  TokenSparkline,
} from '../components/tokens/TokenSparkline';

export const useTokenTableColumns = () => {
  const columns: ColumnDef<TokenItem, TokenItem>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Token',
        footer: 'Token',
        accessorKey: 'name',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.name || '',
            rowB.original?.name || ''
          ),
        cell: (info) => {
          const token = info?.getValue();
          return (
            <div className="flex items-center gap-2">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand">
                  <LucideIcons.X className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {token.name}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'balance',
        header: 'Balance',
        footer: 'Balance',
        accessorKey: 'balance',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.balance || 0,
            rowB.original?.balance || 0
          ),
        cell: (info) => {
          const token = info?.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="font-medium">
                {formatNumber(parseFloat(token.balance || '0'), 4)}{' '}
                <Typography tag="span" className="text-sm font-normal">
                  {token.symbol}
                </Typography>
              </div>
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
          const token = info?.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="font-medium">{formatCurrency(token.value)}</div>
            </div>
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
          const token = info?.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="font-medium">{formatCurrency(token.price)}</div>
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
          const token = info?.getValue();
          return (
            <div className="flex items-center gap-2">
              <div
                className={
                  token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {formatPercentage(token.priceChange24h)}
              </div>
            </div>
          );
        },
      },
      {
        id: 'sparkline',
        header: 'Trend',
        footer: 'Trend',
        accessorKey: 'sparkline',
        accessorFn: (row) => row,
        cell: (info) => {
          const token = info?.getValue();
          return (
            <TokenSparkline
              data={generateSparklineData(
                token.price,
                token.priceChange24h >= 0
              )}
              isPositive={token.priceChange24h >= 0}
            />
          );
        },
      },
    ],
    []
  );
  return { columns: columns || [] };
};

export default useTokenTableColumns;
