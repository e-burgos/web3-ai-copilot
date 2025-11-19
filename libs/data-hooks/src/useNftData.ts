import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ZerionPosition, ZerionApiResponse, createZerionHeaders } from './types/zerionTypes';

interface NftData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  collection: string;
  chainId: number;
  value?: number;
}

export function useNftData(address?: string) {
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<NftData[]>({
    queryKey: ['nftData', targetAddress],
    queryFn: async () => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const apiKey = import.meta.env.VITE_ZERION_API_KEY;
      const headers = createZerionHeaders(apiKey);

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${targetAddress}/positions/?currency=usd&filter[positions_types]=non_fungible`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch NFT data: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionApiResponse;
      const positions = data.data || [];

      return positions
        .filter((pos: ZerionPosition) => pos.type === 'non_fungible')
        .map((pos: ZerionPosition) => ({
          id: pos.id,
          name: pos.attributes?.name || 'Unnamed NFT',
          description: pos.attributes?.description,
          image: pos.attributes?.content?.preview?.url || pos.attributes?.preview?.url,
          collection: pos.attributes?.collection?.name || 'Unknown Collection',
          chainId: pos.chain_id || 1,
          value: pos.value || 0,
        }));
    },
    enabled: !!targetAddress,
    staleTime: 60 * 1000, // 1 minute
  });
}
