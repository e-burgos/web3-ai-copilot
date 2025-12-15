import { NftItem, ZerionNftPosition } from '../types/nfts';

export const nftsMapper = (nfts: ZerionNftPosition[]): NftItem[] => {
  if (!nfts || !Array.isArray(nfts)) {
    return [];
  }

  return (
    (nfts.map((nft: ZerionNftPosition) => ({
      id: nft.id,
      // @ts-expect-error - nft_info.name may not be in ZerionNftPosition type definition
      name: nft.attributes?.nft_info?.name || 'Unknown NFT',
      collection: nft.attributes?.collection_info?.name || 'Unknown Collection',
      chainId: nft.relationships?.chain?.data?.id || 1,
      // @ts-expect-error - value may not be in ZerionNftPosition type definition
      value: nft.attributes?.value || 0,
      // @ts-expect-error - price may not be in ZerionNftPosition type definition
      price: nft.attributes?.price || 0,
      description: nft.attributes?.collection_info?.description,
      image: nft.attributes?.nft_info?.content?.detail?.url,
      previewImage: nft.attributes?.nft_info?.content?.preview?.url,
      contractAddress: nft.attributes?.nft_info?.contract_address,
      // @ts-expect-error - token_id may not be in ZerionNftPosition type definition
      tokenId: nft.attributes?.nft_info?.token_id,
      // @ts-expect-error - interface may not be in ZerionNftPosition type definition
      interface: nft.attributes?.nft_info?.interface,
    })) as NftItem[]) || []
  );
};
