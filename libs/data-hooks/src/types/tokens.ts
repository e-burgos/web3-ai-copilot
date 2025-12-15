import { ZerionPaginationInfo } from './pagination';

export interface TokenItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  balance: string;
  value: number;
  logo?: string;
  chainId?: number;
}

export interface TokenDataResponse {
  data: TokenItem[];
  pagination?: ZerionPaginationInfo;
}
