import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { backendClient } from '../client/backendClient';
import { transactionsMapper } from '../mappers/transactionsMapper';
import { TransactionDataResponse } from '../types/transactions';
import {
  defaultPaginationStrategy,
  cursorCache,
} from '../utils/zerionPagination';

export function useTransactionData({
  address,
  pageSize = 10,
  pageIndex = 0,
  search = '',
}: {
  address?: string;
  pageSize?: number;
  pageIndex?: number;
  search?: string;
} = {}): UseQueryResult<TransactionDataResponse, Error> {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<TransactionDataResponse>({
    queryKey: [
      'transactionData',
      targetAddress,
      `chainId-${chainId}`,
      pageSize,
      pageIndex,
      search,
    ],
    queryFn: async (): Promise<TransactionDataResponse> => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      // Clear cache when address or search changes
      if (pageIndex === 0) {
        cursorCache.clear();
      }

      const result = await defaultPaginationStrategy.fetchPage(
        async (cursor?: string) => {
          const pageData = await backendClient.getTransactions(targetAddress, {
            filter: {
              search_query: search,
            },
            page: {
              size: pageSize,
              ...(cursor ? { after: cursor } : {}),
            },
          });

          return {
            links: pageData.links,
            meta: pageData.meta,
            data: pageData.data || [],
          };
        },
        pageIndex,
        pageSize,
        transactionsMapper
      );

      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
    placeholderData: keepPreviousData,
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}
