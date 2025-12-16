import { useState, useMemo } from 'react';
import {
  useAllNftsData,
  NftItem,
  NFTSortType,
} from '@web3-ai-copilot/data-hooks';
import {
  Button,
  CardContainer,
  LucideIcons,
  Typography,
} from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { DataTable, TanstackTable } from '@e-burgos/tucutable';
import TableSearcher from '../common/TableSearcher';
import useNftTableColumns from '../../hooks/nfts-table/useNftTableColumns';
import { useNftTableActions } from '../../hooks/nfts-table/useNftTableActions';
import { NftSortFilter } from './NftSortFilter';

export function NftTable() {
  const [search, setSearch] = useState<string>('');

  const { rowActions } = useNftTableActions();
  const { columns } = useNftTableColumns();

  const [pagination, setPagination] = useState<TanstackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sort, setSort] = useState<NFTSortType>('floor_price');

  const { data, isLoading, isFetching, isError, refetch } = useAllNftsData({
    sort,
  });

  const tableId = 'nfts-table';

  const nftsData = useMemo<NftItem[]>(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    return data.data;
  }, [data]);

  // Filter NFTs by search (client-side filtering on current page)
  const filteredNfts = useMemo(() => {
    if (!search) return nftsData;

    const searchLower = search.toLowerCase();
    return nftsData.filter(
      (nft) =>
        nft.name?.toLowerCase().includes(searchLower) ||
        nft.collection?.toLowerCase().includes(searchLower) ||
        nft.tokenId?.toLowerCase().includes(searchLower)
    );
  }, [nftsData, search]);

  const totalCount = useMemo(() => {
    return data?.data?.length || 0;
  }, [data?.data?.length]);

  // Slice data for manual pagination - only show current page items
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredNfts.slice(start, end);
  }, [filteredNfts, pagination]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-16" />
        ))}
      </div>
    );
  }

  if (nftsData.length === 0) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.Image className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No NFTs found
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <>
      <CardContainer className="flex flex-col w-full space-y-2 overflow-x-auto">
        <DataTable
          tableId={tableId}
          data={paginatedData || []}
          columns={columns}
          isError={isError}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={{
            showPagination: true,
            hideRecordsSelector: false,
            rowsInfo: true,
            manualPagination: {
              enabled: true,
              rowCount: totalCount,
              pagination,
              setPagination,
            },
          }}
          rowActions={rowActions}
          headerOptions={{
            headerContainer: (
              <div className="flex justify-between items-center gap-2 sm:flex-row flex-col w-full sm:h-20 h-30 p-4">
                <TableSearcher
                  placeholder="Search NFT"
                  search={search}
                  setSearch={setSearch}
                  onClear={() => {
                    setSearch('');
                  }}
                />
                <div className="flex items-center gap-2 w-full justify-end">
                  <NftSortFilter sort={sort} setSort={setSort} />
                  <Button
                    variant="solid"
                    shape="circle"
                    size="tiny"
                    onClick={() => {
                      refetch();
                      setPagination({
                        pageIndex: 0,
                        pageSize: 10,
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <LucideIcons.RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ),
          }}
          stateMessage={{
            noData:
              search && nftsData.length === 0
                ? 'No found NFTs'.toLocaleUpperCase()
                : 'No NFTs found'.toLocaleUpperCase(),
            noDataDescription:
              search && nftsData.length === 0
                ? 'Try with another search.'
                : 'Add an NFT to start.',
          }}
        />
      </CardContainer>
    </>
  );
}
