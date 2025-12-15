import { ZerionPosition } from '../types/positions';
import { DefiPositionItem } from '../types/deFi';

export const deFiPositionsMapper = (
  positions: ZerionPosition[]
): DefiPositionItem[] => {
  if (!positions || !Array.isArray(positions)) {
    return [];
  }

  return (
    (positions.map((position: ZerionPosition) => ({
      id: position.id,
      name: position.attributes?.name || 'Unknown Name',
      tokenName:
        position.attributes?.fungible_info?.name || 'Unknown Token Name',
      tokenSymbol:
        position.attributes?.fungible_info?.symbol || 'Unknown Token Symbol',
      protocol: position.attributes?.protocol || 'Unknown Protocol',
      type: position.attributes?.position_type || 'Unknown Type',
      chainId: position.relationships?.chain?.data?.id || 1,
      value: position.attributes?.value || 0,
      price: position.attributes?.price || 0,
      // @ts-expect-error - apy may not be in ZerionPosition type definition
      apy: position.attributes?.apy || 0,
      // @ts-expect-error - pool_address may not be in ZerionPosition type definition
      poolAddress: position.attributes?.pool_address || undefined,
      priceChange24h: position.attributes?.changes?.percent_1d || 0,
    })) as DefiPositionItem[]) || []
  );
};
