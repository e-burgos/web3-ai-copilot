import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  ZerionPosition,
  ZerionApiResponse,
  createZerionHeaders,
  ZerionFungiblePositionsResponse,
  ZerionFungiblePosition,
} from './types/zerionTypes';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  balance: string;
  value: number;
  logo?: string;
  chainId: number;
}

export function useTokenData(address?: string) {
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<TokenData[]>({
    queryKey: ['tokenData', targetAddress],
    queryFn: async () => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const apiKey = import.meta.env.VITE_ZERION_API_KEY;
      const headers = createZerionHeaders(apiKey);

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${targetAddress}/positions/?filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value&sync=false`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch token data: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionFungiblePositionsResponse;
      const tokens: TokenData[] =
        data.data.map((pos: ZerionFungiblePosition) => ({
          id: pos.id,
          symbol: pos.attributes.fungible_info.symbol || 'UNKNOWN',
          name: pos.attributes.fungible_info.name || 'Unknown Token',
          price: pos.attributes.price,
          priceChange24h: pos.attributes.changes.percent_1d || 0,
          balance: pos.attributes.quantity.numeric,
          value: pos.attributes.value || 0,
          logo: pos.attributes.fungible_info.icon?.url,
          chainId: parseInt(pos.relationships.chain.data.id),
        })) || [];
      return tokens;
    },
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}
