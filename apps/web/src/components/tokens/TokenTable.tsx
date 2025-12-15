import { useState, useMemo } from 'react';
import { TokenItem, useAllTokenData } from '@web3-ai-copilot/data-hooks';
import {
  Button,
  CardContainer,
  LucideIcons,
  Typography,
} from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { DataTable, TanstackTable } from '@e-burgos/tucutable';
import TableSearcher from '../common/TableSearcher';
import useTokenTableColumns from '../../hooks/useTokenTableColumns';

export function TokenTable() {
  const { columns } = useTokenTableColumns();
  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState<TanstackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, isError } = useAllTokenData();

  const tableId = 'tokens-table';

  const tokensData = useMemo<TokenItem[]>(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    return data.data;
  }, [data]);

  // Filter transactions by search (client-side filtering on current page)
  const filteredTokens = useMemo(() => {
    if (!search) return tokensData;

    const searchLower = search.toLowerCase();
    return tokensData.filter(
      (token) =>
        token.name?.toLowerCase().includes(searchLower) ||
        token.symbol?.toLowerCase().includes(searchLower)
    );
  }, [tokensData, search]);

  const totalCount = useMemo(() => {
    return data?.data?.length || 0;
  }, [data?.data?.length]);

  // Slice data for manual pagination - only show current page items
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTokens.slice(start, end);
  }, [filteredTokens, pagination]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-16" />
        ))}
      </div>
    );
  }

  if (tokensData.length === 0) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.CoinsIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No tokens found
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
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
        headerOptions={{
          headerContainer: (
            <div className="flex justify-between items-center gap-4 sm:flex-row flex-col w-full sm:h-20 h-30 p-4">
              <TableSearcher
                placeholder="Search Token"
                search={search}
                setSearch={setSearch}
                onClear={() => {
                  setSearch('');
                }}
              />
              <Button
                variant="solid"
                shape="circle"
                size="tiny"
                onClick={() => {
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
          ),
        }}
        stateMessage={{
          noData:
            search && tokensData.length === 0
              ? 'No found tokens'.toLocaleUpperCase()
              : 'No tokens found'.toLocaleUpperCase(),
          noDataDescription:
            search && tokensData.length === 0
              ? 'Try with another search.'
              : 'Add a token to start.',
        }}
      />
    </CardContainer>
  );
}
