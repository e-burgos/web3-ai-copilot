import { ZerionPaginationInfo } from './pagination';

export interface TransactionItem {
  id: string;
  hash: string;
  operation_type: string;
  mined_at: number;
  sent_from: string;
  sent_to: string;
  fee: number;
  transfers: {
    fungible_info: {
      name: string;
      symbol: string;
      icon?: {
        url: string;
      };
    };
    quantity: string;
    value: number | undefined;
    price: number | undefined;
  }[];
}

export interface TransactionDataResponse {
  data: TransactionItem[];
  pagination: ZerionPaginationInfo;
}
