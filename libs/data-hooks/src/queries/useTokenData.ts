import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { TokenDataResponse } from '../types/tokens';
import { tokensMapper } from '../mappers/tokensMapper';
import { backendClient } from '../client/backendClient';
import {
  defaultPaginationStrategy,
  cursorCache,
} from '../utils/zerionPagination';

export function useTokenData({
  address,
  pageSize = 100,
  pageIndex = 0,
  filter = 'no_filter',
  trash = 'only_non_trash',
}: {
  address?: string;
  pageSize?: number;
  pageIndex?: number;
  filter?: 'only_simple' | 'only_complex' | 'no_filter';
  trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
} = {}): UseQueryResult<TokenDataResponse, Error> {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<TokenDataResponse>({
    queryKey: [
      'tokenData',
      targetAddress,
      `chainId-${chainId}`,
      filter,
      trash,
      pageSize,
      pageIndex,
    ],
    queryFn: async (): Promise<TokenDataResponse> => {
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
              positions: filter,
              trash: trash,
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
        tokensMapper
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

export function useAllTokenData({
  address,
  filter = 'no_filter',
  trash = 'only_non_trash',
}: {
  address?: string;
  filter?: 'only_simple' | 'only_complex' | 'no_filter';
  trash?: 'only_trash' | 'only_non_trash' | 'no_filter';
} = {}): UseQueryResult<TokenDataResponse, Error> {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<TokenDataResponse>({
    queryKey: ['allTokenData', targetAddress, `chainId-${chainId}`],
    queryFn: async (): Promise<TokenDataResponse> => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const result = await backendClient.getAllPositions(targetAddress, {
        filter: {
          positions: filter,
          trash: trash,
        },
        sort: 'value',
      });

      return {
        data: tokensMapper(result),
      } as TokenDataResponse;
    },
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}
