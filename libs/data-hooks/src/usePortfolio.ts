import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { createZerionHeaders, ZerionPortfolioResponse } from './types/zerionTypes';
interface PortfolioData {
  portfolio: ZerionPortfolioResponse['data'];
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
      const headers = createZerionHeaders(apiKey);

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${address}/portfolio?filter[positions]=only_simple&currency=usd`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionPortfolioResponse;
      const portfolio = data.data;
      const totalValue = data.data.attributes.total.positions;

      return {
        portfolio: portfolio as ZerionPortfolioResponse['data'],
        totalValue,
      };
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
}
