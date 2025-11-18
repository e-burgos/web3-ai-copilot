export interface ZerionPosition {
  id: string;
  type: string;
  chain_id?: number;
  price?: number;
  price_change_24h?: number;
  quantity?: string;
  value?: number;
  attributes?: {
    fungible_info?: {
      symbol?: string;
      name?: string;
      icon?: {
        url?: string;
      };
    };
    name?: string;
    description?: string;
    content?: {
      preview?: {
        url?: string;
      };
    };
    preview?: {
      url?: string;
    };
    collection?: {
      name?: string;
    };
    protocol?: {
      name?: string;
    };
    position_type?: string;
    apy?: number;
    [key: string]: unknown;
  };
}

export interface ZerionApiResponse {
  data: ZerionPosition[];
}

