import { useAccount } from 'wagmi';
import { supportedChains, nativeTokens } from '../config/chains';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { createPublicClient, http } from 'viem';

interface ChainBalance {
  chainId: number;
  chainName: string;
  balance: string;
  symbol: string;
  formatted: string;
}

export function useMultiChainBalance() {
  const { address } = useAccount();

  const balances = useQuery<ChainBalance[]>({
    queryKey: ['multiChainBalance', address],
    queryFn: async () => {
      if (!address) {
        return [];
      }

      const balancePromises = supportedChains.map(async (chain) => {
        try {
          const publicClient = createPublicClient({
            chain,
            transport: http(),
          });

          const balance = await publicClient.getBalance({
            address: address as `0x${string}`,
          });

          const formatted = formatUnits(balance, 18);

          return {
            chainId: chain.id,
            chainName: chain.name,
            balance: balance.toString(),
            symbol: nativeTokens[chain.id] || 'ETH',
            formatted,
          };
        } catch (error) {
          console.error(`Error fetching balance for chain ${chain.id}:`, error);
          return {
            chainId: chain.id,
            chainName: chain.name,
            balance: '0',
            symbol: nativeTokens[chain.id] || 'ETH',
            formatted: '0',
          };
        }
      });

      return Promise.all(balancePromises);
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
  });

  return balances;
}

