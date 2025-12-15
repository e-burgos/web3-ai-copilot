import { ZerionPosition } from '../types/positions';
import { TokenItem } from '../types/tokens';

export const tokensMapper = (positions: ZerionPosition[]): TokenItem[] => {
  if (!positions || !Array.isArray(positions)) {
    return [];
  }

  return (
    (positions.map((pos: ZerionPosition) => ({
      id: pos.id,
      symbol: pos.attributes?.fungible_info.symbol || 'UNKNOWN',
      name: pos.attributes?.fungible_info.name || 'Unknown Token',
      price: pos.attributes?.price,
      priceChange24h: pos.attributes?.changes?.percent_1d || 0,
      balance: pos.attributes.quantity.numeric,
      value: pos.attributes.value || 0,
      logo: pos.attributes.fungible_info.icon?.url,
      chainId: parseInt(pos.relationships?.chain?.data?.id || '0'),
    })) as TokenItem[]) || []
  );
};
