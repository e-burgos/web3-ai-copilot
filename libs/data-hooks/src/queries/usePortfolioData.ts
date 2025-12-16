import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { Portfolio, PortfolioDataResponse } from '../types';
import { backendClient } from '../client/backendClient';
import { ApiResponse } from 'zerion-sdk-ts';

export function usePortfolioData({
  address,
}: { address?: string } = {}): UseQueryResult<PortfolioDataResponse, Error> {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<PortfolioDataResponse>({
    queryKey: ['portfolio-data', targetAddress, `chainId-${chainId}`],
    queryFn: async (): Promise<PortfolioDataResponse> => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }
      const response: ApiResponse<Portfolio> = await backendClient.getPortfolio(
        targetAddress,
        {
          positions: 'no_filter',
        }
      );
      return {
        data: response?.data?.attributes || {},
      } as PortfolioDataResponse;
    },
    placeholderData: keepPreviousData,
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}
