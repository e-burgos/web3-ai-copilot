import { ZerionPaginationInfo } from '.';
import { NFTPosition } from 'zerion-sdk-ts';

export interface NftItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  previewImage?: string;
  collection: string;
  chainId: number;
  value?: number;
  price?: number;
  contractAddress?: string;
  tokenId?: string;
  interface?: string;
}

export type NFTSortType =
  | '-floor_price'
  | 'floor_price'
  | '-created_at'
  | 'created_at';

export interface NftDataResponse {
  data: NftItem[];
  pagination?: ZerionPaginationInfo;
}

export type { NFTPosition as ZerionNftPosition };
