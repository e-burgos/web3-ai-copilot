import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { DefiPositionResponse } from '../types/deFi';
import { backendClient } from '../client/backendClient';
import {
  cursorCache,
  defaultPaginationStrategy,
} from '../utils/zerionPagination';
import { deFiPositionsMapper } from '../mappers/deFiPositionsMapper';

export function useDeFiPositionsData({
  address,
  pageSize = 100,
  pageIndex = 0,
  filter = 'only_complex',
  trash = 'only_non_trash',
}: {
  address?: string;
  pageSize?: number;
  pageIndex?: number;
  filter?: 'only_simple' | 'only_complex' | 'no_filter';
  trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
} = {}) {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<DefiPositionResponse>({
    queryKey: [
      'defiPositions',
      targetAddress,
      `chainId-${chainId}`,
      pageSize,
      pageIndex,
    ],
    queryFn: async (): Promise<DefiPositionResponse> => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      if (pageIndex === 0) {
        cursorCache.clear();
      }

      const result = await defaultPaginationStrategy.fetchPage(
        async (cursor?: string) => {
          const pageData = await backendClient.getPositions(targetAddress, {
            filter: {
              trash: trash,
              positions: filter,
            },
            sort: 'value',
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
        deFiPositionsMapper
      );

      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}

export const useDeFiPositionsDataMutation = (): UseMutationResult<
  DefiPositionResponse,
  Error,
  {
    address?: string;
    pageSize?: number;
    pageIndex?: number;
    filter?: 'only_simple' | 'only_complex' | 'no_filter';
    trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
  }
> => {
  return useMutation<
    DefiPositionResponse,
    Error,
    {
      address?: string;
      pageSize?: number;
      pageIndex?: number;
      filter?: 'only_simple' | 'only_complex' | 'no_filter';
      trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
    }
  >({
    mutationKey: ['defiPositionsDataMutation'],
    mutationFn: async ({
      address,
      pageSize,
      pageIndex,
      filter,
      trash,
    }: {
      address?: string;
      pageSize?: number;
      pageIndex?: number;
      filter?: 'only_simple' | 'only_complex' | 'no_filter';
      trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
    }): Promise<DefiPositionResponse> => {
      if (!address) {
        throw new Error('No address provided');
      }

      if (pageIndex === 0) {
        cursorCache.clear();
      }

      const result = await defaultPaginationStrategy.fetchPage(
        async (cursor?: string) => {
          const pageData = await backendClient.getPositions(address, {
            filter: {
              trash: trash,
              positions: filter,
            },
            sort: 'value',
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
        pageIndex || 0,
        pageSize || 100,
        deFiPositionsMapper
      );

      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
  });
};
