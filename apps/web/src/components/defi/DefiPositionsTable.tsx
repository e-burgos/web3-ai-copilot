import { useState, useMemo } from 'react';
import {
  DefiPositionItem,
  useDeFiPositionsData,
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
import useDeFiTableColumns from '../../hooks/useDeFiTableColumns';

export function DefiPositionsTable() {
  const { columns } = useDeFiTableColumns();
  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState<TanstackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, isError } = useDeFiPositionsData();

  const tableId = 'defi-positions-table';

  const positionsData = useMemo<DefiPositionItem[]>(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    return data.data;
  }, [data]);

  // Filter positions by search (client-side filtering on current page)
  const filteredPositions = useMemo(() => {
    if (!search) return positionsData;

    const searchLower = search.toLowerCase();
    return positionsData.filter(
      (position) =>
        position.name?.toLowerCase().includes(searchLower) ||
        position.protocol?.toLowerCase().includes(searchLower) ||
        position.tokenName?.toLowerCase().includes(searchLower) ||
        position.tokenSymbol?.toLowerCase().includes(searchLower) ||
        position.type?.toLowerCase().includes(searchLower)
    );
  }, [positionsData, search]);

  const totalCount = useMemo(() => {
    return data?.data?.length || 0;
  }, [data?.data?.length]);

  // Slice data for manual pagination - only show current page items
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredPositions.slice(start, end);
  }, [filteredPositions, pagination]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-16" />
        ))}
      </div>
    );
  }

  if (positionsData.length === 0) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.TrendingUp className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No DeFi positions found
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
            <div className="flex justify-between items-center gap-2 w-full sm:h-20 h-30 p-4">
              <TableSearcher
                placeholder="Search DeFi Position"
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
            search && positionsData.length === 0
              ? 'No found positions'.toLocaleUpperCase()
              : 'No DeFi positions found'.toLocaleUpperCase(),
          noDataDescription:
            search && positionsData.length === 0
              ? 'Try with another search.'
              : 'Add a DeFi position to start.',
        }}
      />
    </CardContainer>
  );
}
