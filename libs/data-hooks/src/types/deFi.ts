import { ZerionPaginationInfo } from './pagination';

export interface DefiPositionItem {
  id: string;
  name: string;
  tokenName: string;
  tokenSymbol: string;
  protocol: string;
  type: string;
  chainId: number;
  value: number;
  price: number;
  apy?: number;
  poolAddress?: string;
  priceChange24h?: number;
}

export interface DefiPositionResponse {
  data: DefiPositionItem[];
  pagination: ZerionPaginationInfo;
}
