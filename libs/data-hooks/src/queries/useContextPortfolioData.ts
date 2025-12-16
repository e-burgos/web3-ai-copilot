import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  ContextPortfolioData,
  DefiPositionResponse,
  NftDataResponse,
} from '../types';
import { PortfolioDataResponse } from '../types/portfolio';
import { TokenDataResponse } from '../types/tokens';
import { TransactionDataResponse } from '../types/transactions';
import { backendClient } from '../client/backendClient';
import { ApiResponse } from 'zerion-sdk-ts';
import { Portfolio } from '../types/portfolio';
import { tokensMapper } from '../mappers/tokensMapper';
import { transactionsMapper } from '../mappers/transactionsMapper';
import { nftsMapper } from '../mappers/nftsMapper';
import { deFiPositionsMapper } from '../mappers/deFiPositionsMapper';
import {
  defaultPaginationStrategy,
  cursorCache,
} from '../utils/zerionPagination';

export function useContextPortfolioData(): UseQueryResult<
  ContextPortfolioData | null,
  Error
> {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  return useQuery<ContextPortfolioData | null>({
    queryKey: ['contextPortfolioData', address],
    queryFn: async (): Promise<ContextPortfolioData | null> => {
      if (!address) {
        return null;
      }

      // Fetch all data in parallel using fetchQuery to force execution
      const [
        portfolioResult,
        tokensResult,
        transactionsResult,
        nftsResult,
        defiResult,
      ] = await Promise.allSettled([
        // Portfolio data
        queryClient.fetchQuery<PortfolioDataResponse>({
          queryKey: ['portfolio-data', address],
          queryFn: async (): Promise<PortfolioDataResponse> => {
            const response: ApiResponse<Portfolio> =
              await backendClient.getPortfolio(address, {
                positions: 'no_filter',
              });
            return {
              data: response?.data?.attributes || {},
            } as PortfolioDataResponse;
          },
          staleTime: 30 * 1000,
        }),

        // All tokens data
        queryClient.fetchQuery<TokenDataResponse>({
          queryKey: ['allTokenData', address],
          queryFn: async (): Promise<TokenDataResponse> => {
            const result = await backendClient.getAllPositions(address, {
              filter: {
                positions: 'no_filter',
                trash: 'only_non_trash',
              },
              sort: 'value',
            });

            return {
              data: tokensMapper(result),
            } as TokenDataResponse;
          },
          staleTime: 30 * 1000,
        }),

        // Recent transactions (first page)
        queryClient.fetchQuery<TransactionDataResponse>({
          queryKey: ['transactionData', address, 10, 0, ''],
          queryFn: async (): Promise<TransactionDataResponse> => {
            cursorCache.clear();

            const result = await defaultPaginationStrategy.fetchPage(
              async (cursor?: string) => {
                const pageData = await backendClient.getTransactions(address, {
                  filter: {
                    search_query: '',
                  },
                  page: {
                    size: 10,
                    ...(cursor ? { after: cursor } : {}),
                  },
                });

                return {
                  links: pageData.links,
                  meta: pageData.meta,
                  data: pageData.data || [],
                };
              },
              0,
              10,
              transactionsMapper
            );

            return {
              data: result.data,
              pagination: result.pagination,
            };
          },
          staleTime: 30 * 1000,
        }),

        // All NFTs data
        queryClient.fetchQuery<NftDataResponse>({
          queryKey: ['allNftsData', address],
          queryFn: async (): Promise<NftDataResponse> => {
            const result = await backendClient.getAllNFTPositions(address, {
              filter: {
                chain_ids: [],
                collections_ids: [],
              },
            });

            return {
              data: nftsMapper(result),
            } as NftDataResponse;
          },
          staleTime: 60 * 1000,
        }),

        // DeFi positions (first page)
        queryClient.fetchQuery<DefiPositionResponse>({
          queryKey: ['defiPositions', address, 100, 0],
          queryFn: async (): Promise<DefiPositionResponse> => {
            cursorCache.clear();

            const result = await defaultPaginationStrategy.fetchPage(
              async (cursor?: string) => {
                const pageData = await backendClient.getPositions(address, {
                  filter: {
                    trash: 'only_non_trash',
                    positions: 'only_complex',
                  },
                  sort: 'value',
                  page: {
                    size: 100,
                    ...(cursor ? { after: cursor } : {}),
                  },
                });

                return {
                  links: pageData.links,
                  meta: pageData.meta,
                  data: pageData.data || [],
                };
              },
              0,
              100,
              deFiPositionsMapper
            );

            return {
              data: result.data,
              pagination: result.pagination,
            };
          },
          staleTime: 30 * 1000,
        }),
      ]);

      // Extract data from results, handling both success and failure
      const portfolioData =
        portfolioResult.status === 'fulfilled' ? portfolioResult.value : null;

      const tokenData =
        tokensResult.status === 'fulfilled' ? tokensResult.value : null;

      const transactionData =
        transactionsResult.status === 'fulfilled'
          ? transactionsResult.value
          : null;

      const nftData =
        nftsResult.status === 'fulfilled' ? nftsResult.value : null;

      const defiPositions =
        defiResult.status === 'fulfilled' ? defiResult.value : null;

      const contextPortfolioData: ContextPortfolioData = {
        address,
        portfolio: portfolioData?.data || undefined,
        tokens: tokenData?.data || [],
        recentTransactions: transactionData?.data || [],
        nfts: nftData?.data || [],
        defiPositions: defiPositions?.data || [],
      };

      return contextPortfolioData;
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
