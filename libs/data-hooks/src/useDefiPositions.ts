import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ZerionPosition, ZerionApiResponse } from './types/zerionTypes';

interface DefiPosition {
  id: string;
  protocol: string;
  type: string;
  chainId: number;
  value: number;
  apy?: number;
  details: Record<string, unknown>;
}

export function useDefiPositions(address?: string) {
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<DefiPosition[]>({
    queryKey: ['defiPositions', targetAddress],
    queryFn: async () => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const apiKey = import.meta.env.VITE_ZERION_API_KEY;
      if (!apiKey) {
        throw new Error('Zerion API key not configured');
      }

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${targetAddress}/positions/?currency=usd&filter[positions_types]=position`,
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch DeFi positions: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionApiResponse;
      const positions = data.data || [];

      return positions
        .filter((pos: ZerionPosition) => pos.type === 'position')
        .map((pos: ZerionPosition) => ({
          id: pos.id,
          protocol: pos.attributes?.protocol?.name || 'Unknown Protocol',
          type: pos.attributes?.position_type || 'Unknown',
          chainId: pos.chain_id || 1,
          value: pos.value || 0,
          apy: pos.attributes?.apy,
          details: (pos.attributes || {}) as Record<string, unknown>,
        }));
    },
    enabled: !!targetAddress,
    staleTime: 60 * 1000, // 1 minute
  });
}

