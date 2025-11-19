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
  links?: {
    next?: string;
    prev?: string;
  };
  meta?: {
    total_records?: number;
    total_pages?: number;
    current_page?: number;
  };
}

export interface ZerionPortfolioResponse {
  links: {
    self: string;
  };
  data: {
    type: string;
    id: string;
    attributes: {
      positions_distribution_by_type: {
        wallet: number;
        deposited: number;
        borrowed: number;
        locked: number;
        staked: number;
      };
      positions_distribution_by_chain: {
        [key: string]: number;
      };
      total: {
        positions: number;
      };
      changes: {
        absolute_1d: number;
        percent_1d: number;
      };
    };
  };
}

// Shared types for Zerion API responses
export interface ZerionFungibleInfo {
  name?: string;
  symbol?: string;
  icon?: {
    url?: string;
  };
  flags?: {
    verified?: boolean;
  };
  implementations?: Array<{
    chain_id?: string;
    address?: string;
    decimals?: number;
  }>;
}

export interface ZerionQuantity {
  int: string;
  decimals: string;
  float: number;
  numeric: string;
}

export interface ZerionTransfer {
  fungible_info?: ZerionFungibleInfo;
  direction: string;
  quantity: ZerionQuantity;
  value?: number;
  price?: number;
  nfts?: null;
  approvals?: null;
}

export interface ZerionFee {
  fungible_info?: ZerionFungibleInfo;
  quantity: ZerionQuantity;
  value?: number;
}

export interface ZerionTransactionAttributes {
  operation_type: string;
  hash: string;
  mined_at_block: number;
  mined_at: string;
  sent_from: string;
  sent_to: string;
  fee?: ZerionFee;
  transfers: ZerionTransfer[];
  approvals?: null;
  nonce?: number;
  status: string;
}

export interface ZerionTransactionRelationships {
  chain: {
    links: {
      related: string;
    };
    data: {
      type: string;
      id: string;
    };
  };
}

export interface ZerionTransaction {
  id: string;
  type: string;
  attributes: ZerionTransactionAttributes;
  relationships: ZerionTransactionRelationships;
}

export interface ZerionChain {
  id: string;
  type: string;
  attributes: {
    name: string;
    short_name: string;
    coin: number;
    is_testnet: boolean;
    deployed_at: string;
    icon?: {
      url?: string;
    };
  };
}

export interface ZerionTransactionResponse {
  links: {
    self: string;
    next?: string;
  };
  data: ZerionTransaction[];
  included: ZerionChain[];
  meta: {
    total_records: number;
    total_pages: number;
    current_page: number;
  };
}

export interface ZerionFungiblePositionAttributes {
  parent: null;
  protocol: null;
  name: string;
  position_type: string;
  quantity: ZerionQuantity;
  value: number;
  price: number;
  changes: {
    absolute_1d: number;
    percent_1d: number;
  };
  fungible_info: ZerionFungibleInfo;
  flags: {
    displayable: boolean;
    is_trash: boolean;
  };
  updated_at: string;
  updated_at_block: number;
}

export interface ZerionFungiblePositionRelationships {
  chain: {
    links: {
      related: string;
    };
    data: {
      type: string;
      id: string;
    };
  };
  fungible: {
    links: {
      related: string;
    };
    data: {
      type: string;
      id: string;
    };
  };
}

export interface ZerionFungiblePosition {
  type: string;
  id: string;
  attributes: ZerionFungiblePositionAttributes;
  relationships: ZerionFungiblePositionRelationships;
}

export interface ZerionFungiblePositionsResponse {
  links: {
    self: string;
  };
  data: ZerionFungiblePosition[];
}

// Helper function to create proper Zerion API headers
export function createZerionHeaders(apiKey: string) {
  if (!apiKey) {
    throw new Error('Zerion API key not configured');
  }

  // Zerion uses Basic Auth with API key as username and empty password
  // Format: Basic base64(apiKey + ':')
  const credentials = btoa(`${apiKey}:`);

  return {
    accept: 'application/json',
    authorization: `Basic ${credentials}`,
    // Zerion API requires specific user agent for some endpoints
    'user-agent': 'Web3-AI-Copilot/1.0.0',
  };
}
