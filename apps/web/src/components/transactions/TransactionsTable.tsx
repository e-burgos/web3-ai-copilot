import { useState, useMemo } from 'react';
import { useTransactionData } from '@web3-ai-copilot/data-hooks';
import {
  Button,
  CardContainer,
  LucideIcons,
  Typography,
} from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { DataTable } from '@e-burgos/tucutable';
import { PaginationState } from '@tanstack/react-table';
import TableSearcher from '../common/TableSearcher';
import useTransactionTableColumns from '../../hooks/useTransactionTableColumns';
import { TransactionItem } from '@web3-ai-copilot/data-hooks';

export function TransactionsTable() {
  const { columns } = useTransactionTableColumns();
  const [search, setSearch] = useState<string>('');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, isError } = useTransactionData({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    search,
  });

  const tableId = 'transactions-table';

  const transactionsData = useMemo<TransactionItem[]>(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data;
  }, [data]);

  // Filter transactions by search (client-side filtering on current page)
  const filteredTransactions = useMemo(() => {
    if (!search) return transactionsData;

    const searchLower = search.toLowerCase();
    return transactionsData.filter(
      (tx) =>
        tx.operation_type?.toLowerCase().includes(searchLower) ||
        tx.hash?.toLowerCase().includes(searchLower) ||
        tx.sent_from?.toLowerCase().includes(searchLower) ||
        tx.sent_to?.toLowerCase().includes(searchLower) ||
        tx.transfers?.some(
          (t) =>
            t.fungible_info?.name?.toLowerCase().includes(searchLower) ||
            t.fungible_info?.symbol?.toLowerCase().includes(searchLower)
        )
    );
  }, [transactionsData, search]);

  const totalCount = useMemo(() => {
    return data?.pagination?.totalCount && data?.pagination?.totalCount > 0
      ? data?.pagination?.totalCount
      : 200;
  }, [data?.pagination?.totalCount]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-16" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.SendToBack className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            Error loading transactions
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <CardContainer className="flex flex-col w-full space-y-2 overflow-x-auto">
      <DataTable
        tableId={tableId}
        data={filteredTransactions}
        columns={columns}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        border={true}
        pagination={{
          showPagination: true,
          hideRecordsSelector: false,
          rowsInfo: true,
          serverPagination: {
            totalCount,
            pagination,
            setPagination,
          },
        }}
        headerOptions={{
          headerContainer: (
            <div className="flex justify-between items-center gap-2 w-full sm:h-20 h-30 p-4">
              <TableSearcher
                placeholder="Search transaction"
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
          noData: 'No transactions found',
          noDataDescription:
            search && filteredTransactions.length === 0
              ? 'Try with another search.'
              : totalCount === 0
                ? 'No transactions available.'
                : 'No transactions found for this page.',
        }}
      />
    </CardContainer>
  );
}
