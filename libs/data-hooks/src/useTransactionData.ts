import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { createZerionHeaders, ZerionTransactionResponse } from './types/zerionTypes';

export function useTransactionData(address?: string) {
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<ZerionTransactionResponse>({
    queryKey: ['transactionData', targetAddress],
    queryFn: async () => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const apiKey = import.meta.env.VITE_ZERION_API_KEY;
      const headers = createZerionHeaders(apiKey);

      const response = await fetch(
        `https://api.zerion.io/v1/wallets/${targetAddress}/transactions/?currency=usd&page[size]=100&filter[trash]=no_filter&filter[operation_type]=transfer`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch token data: ${response.statusText}`);
      }

      const data = (await response.json()) as ZerionTransactionResponse;
      return data;
    },
    enabled: !!targetAddress,
    staleTime: 30 * 1000,
  });
}
