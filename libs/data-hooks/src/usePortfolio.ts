import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ZerionPosition, ZerionApiResponse } from './types/zerionTypes';

interface PortfolioPosition {
  id: string;
  type: string;
  chainId: number;
  value: number;
  price: number;
  symbol: string;
  quantity: string;
  attributes: {
    fungible_info?: {
      name: string;
      symbol: string;
      icon?: {
        url: string;
      };
      implementations?: {
        decimals: number;
      };
    };
  };
}

interface PortfolioData {
  positions: PortfolioPosition[];
  totalValue: number;
}

export function usePortfolio() {
  const { address } = useAccount();

  return useQuery<PortfolioData>({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('No address provided');
      }

      const apiKey = import.meta.env.VITE_ZERION_API_KEY;
      if (!apiKey) {
        throw new Error('Zerion API key not configured');
      }

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionApiResponse;
      const positions = data.data || [];
      const totalValue = positions.reduce(
        (sum: number, pos: ZerionPosition) => sum + (pos.value || 0),
        0
      );

      return {
        positions: positions as unknown as PortfolioPosition[],
        totalValue,
      };
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
}

