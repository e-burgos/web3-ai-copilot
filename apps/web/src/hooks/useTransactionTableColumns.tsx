import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  sortingCompareNumberFn,
  sortingCompareStringFn,
} from '@e-burgos/tucutable';
import { formatCurrency, formatNumber } from '@web3-ai-copilot/shared-utils';
import { TransactionItem } from '@web3-ai-copilot/data-hooks';

export const useTransactionTableColumns = () => {
  const columns: ColumnDef<TransactionItem, TransactionItem>[] = useMemo(
    () => [
      {
        id: 'operation_type',
        header: 'Operation Type',
        footer: 'Operation Type',
        accessorKey: 'operation_type',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.operation_type || '',
            rowB.original?.operation_type || ''
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-medium capitalize">
              {transaction.operation_type}
            </div>
          );
        },
      },
      {
        id: 'mined_at',
        header: 'Mined At',
        footer: 'Mined At',
        accessorKey: 'mined_at',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.mined_at || 0,
            rowB.original?.mined_at || 0
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          const date = new Date(transaction.mined_at);
          return (
            <div className="text-sm">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </div>
          );
        },
      },
      {
        id: 'sent_from',
        header: 'Sent From',
        footer: 'Sent From',
        accessorKey: 'sent_from',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.sent_from || '',
            rowB.original?.sent_from || ''
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-mono text-sm">
              {transaction.sent_from.slice(0, 6)}...
              {transaction.sent_from.slice(-4)}
            </div>
          );
        },
      },
      {
        id: 'sent_to',
        header: 'Sent To',
        footer: 'Sent To',
        accessorKey: 'sent_to',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.sent_to || '',
            rowB.original?.sent_to || ''
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-mono text-sm">
              {transaction.sent_to.slice(0, 6)}...
              {transaction.sent_to.slice(-4)}
            </div>
          );
        },
      },
      {
        id: 'fee',
        header: 'Fee',
        footer: 'Fee',
        accessorKey: 'fee',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.fee || 0,
            rowB.original?.fee || 0
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-medium">
              {transaction.fee ? formatCurrency(transaction.fee) : '-'}
            </div>
          );
        },
      },
      {
        id: 'transfers',
        header: 'Transfers',
        footer: 'Transfers',
        accessorKey: 'transfers',
        accessorFn: (row) => row,
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="text-sm">
              {transaction.transfers
                .map((transfer) => transfer.fungible_info?.name || 'Unknown')
                .join(', ')}
            </div>
          );
        },
      },
      {
        id: 'quantities',
        header: 'Quantities',
        footer: 'Quantities',
        accessorKey: 'quantities',
        accessorFn: (row) => row,
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="text-sm">
              {transaction.transfers
                .map((transfer) =>
                  formatNumber(parseFloat(transfer.quantity || '0'), 4)
                )
                .join(', ')}
            </div>
          );
        },
      },
      {
        id: 'values',
        header: 'Values',
        footer: 'Values',
        accessorKey: 'values',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) => {
          const totalA =
            rowA.original?.transfers.reduce(
              (sum, t) => sum + (t.value || 0),
              0
            ) || 0;
          const totalB =
            rowB.original?.transfers.reduce(
              (sum, t) => sum + (t.value || 0),
              0
            ) || 0;
          return sortingCompareNumberFn(totalA, totalB);
        },
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-medium">
              {transaction.transfers
                .map((transfer) =>
                  transfer.value ? formatCurrency(transfer.value) : '-'
                )
                .join(', ')}
            </div>
          );
        },
      },
      {
        id: 'prices',
        header: 'Prices',
        footer: 'Prices',
        accessorKey: 'prices',
        accessorFn: (row) => row,
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="text-sm">
              {transaction.transfers
                .map((transfer) =>
                  transfer.price ? formatCurrency(transfer.price) : '-'
                )
                .join(', ')}
            </div>
          );
        },
      },
      {
        id: 'hash',
        header: 'Hash',
        footer: 'Hash',
        accessorKey: 'hash',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.hash || '',
            rowB.original?.hash || ''
          ),
        cell: (info) => {
          const transaction = info?.getValue();
          return (
            <div className="font-mono text-sm">
              {transaction.hash.slice(0, 10)}...
              {transaction.hash.slice(-6)}
            </div>
          );
        },
      },
    ],
    []
  );
  return { columns: columns || [] };
};

export default useTransactionTableColumns;
