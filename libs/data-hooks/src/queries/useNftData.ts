import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAccount, useChainId } from 'wagmi';
import { NftDataResponse, NFTSortType } from '../types/nfts';
import { backendClient } from '../client/backendClient';
import { nftsMapper } from '../mappers/nftsMapper';

export function useAllNftsData({
  address,
  chainIds,
  collectionsIds,
  sort,
}: {
  address?: string;
  chainIds?: string[];
  collectionsIds?: string[];
  sort?: NFTSortType;
} = {}): UseQueryResult<NftDataResponse, Error> {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const targetAddress = address || walletAddress;

  return useQuery<NftDataResponse>({
    queryKey: [
      'allNftsData',
      targetAddress,
      `chainId-${chainId}`,
      chainIds,
      collectionsIds,
      sort,
    ],
    queryFn: async () => {
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const result = await backendClient.getAllNFTPositions(targetAddress, {
        filter: {
          chain_ids: chainIds || [],
          collections_ids: collectionsIds || [],
        },
        sort: sort,
      });

      return {
        data: nftsMapper(result),
      } as NftDataResponse;
    },
    enabled: !!targetAddress,
    staleTime: 60 * 1000, // 1 minute
  });
}
