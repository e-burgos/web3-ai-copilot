import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LucideIcons } from '@e-burgos/tucu-ui';
import { NftItem } from '@web3-ai-copilot/data-hooks';
import {
  sortingCompareNumberFn,
  sortingCompareStringFn,
} from '@e-burgos/tucutable';
import { formatAddress, formatCurrency } from '@web3-ai-copilot/shared-utils';
import { chainNames } from '@web3-ai-copilot/wallet';

export const useNftTableColumns = () => {
  const columns: ColumnDef<NftItem, NftItem>[] = useMemo(
    () => [
      {
        id: 'nft',
        header: 'NFT',
        footer: 'NFT',
        accessorKey: 'name',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.name || '',
            rowB.original?.name || ''
          ),
        cell: (info) => {
          const nft = info?.getValue();
          return (
            <div className={`flex items-center gap-2 hover:opacity-80`}>
              {nft.image || nft.previewImage ? (
                <img
                  src={nft.image || nft.previewImage}
                  alt={nft.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENFT%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand">
                  <LucideIcons.Image className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="font-medium">{nft.name}</div>
                {nft.tokenId && (
                  <div className="text-sm text-muted-foreground truncate overflow-hidden ">
                    Token ID: {formatAddress(nft.tokenId, 6, 4)}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'collection',
        header: 'Collection',
        footer: 'Collection',
        accessorKey: 'collection',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareStringFn(
            rowA.original?.collection || '',
            rowB.original?.collection || ''
          ),
        cell: (info) => {
          const nft = info?.getValue();
          return <div className="font-medium">{nft.collection}</div>;
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
          const nft = info?.getValue();
          return (
            <div className="font-medium">{formatCurrency(nft.price || 0)}</div>
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
          const nft = info?.getValue();
          return (
            <div className="font-medium">{formatCurrency(nft.value || 0)}</div>
          );
        },
      },
      {
        id: 'chain',
        header: 'Chain',
        footer: 'Chain',
        accessorKey: 'chainId',
        accessorFn: (row) => row,
        sortingFn: (rowA, rowB) =>
          sortingCompareNumberFn(
            rowA.original?.chainId || 0,
            rowB.original?.chainId || 0
          ),
        cell: (info) => {
          const nft = info?.getValue();
          const chainName = chainNames[nft.chainId] || `Chain ${nft.chainId}`;
          return <div className="font-medium">{chainName}</div>;
        },
      },
    ],
    []
  );
  return { columns: columns || [] };
};

export default useNftTableColumns;
