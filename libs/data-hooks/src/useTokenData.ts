import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ZerionPosition, ZerionApiResponse } from './types/zerionTypes';

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
      if (!apiKey) {
        throw new Error('Zerion API key not configured');
      }

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${targetAddress}/positions/?currency=usd&filter[positions_types]=fungible`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch token data: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionApiResponse;
      const positions = data.data || [];

      return positions
        .filter((pos: ZerionPosition) => pos.type === 'fungible')
        .map((pos: ZerionPosition) => ({
          id: pos.id,
          symbol: pos.attributes?.fungible_info?.symbol || 'UNKNOWN',
          name: pos.attributes?.fungible_info?.name || 'Unknown Token',
          price: pos.price || 0,
          priceChange24h: pos.price_change_24h || 0,
          balance: pos.quantity || '0',
          value: pos.value || 0,
          logo: pos.attributes?.fungible_info?.icon?.url,
          chainId: pos.chain_id || 1,
        }));
    },
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}

