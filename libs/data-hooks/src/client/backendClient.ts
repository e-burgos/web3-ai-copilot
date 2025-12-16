import type {
  ApiResponse,
  Position,
  NFTPosition,
  Transaction,
} from 'zerion-sdk-ts';
import type { Portfolio } from '../types/portfolio';

const API_BASE_URL =
  import.meta.env.VITE_AI_GATEWAY_URL || 'http://localhost:3001';

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

async function fetchFromBackend<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export interface GetPortfolioOptions {
  positions?: 'no_filter' | 'only_simple' | 'only_complex';
}

export interface GetPositionsOptions {
  filter?: {
    positions?: 'no_filter' | 'only_simple' | 'only_complex';
    trash?: 'no_filter' | 'only_trash' | 'only_non_trash';
    chain_ids?: string[];
  };
  sort?: 'value' | 'name' | 'chain';
  page?: {
    size?: number;
    after?: string;
  };
}

export interface GetNFTPositionsOptions {
  filter?: {
    chain_ids?: string[];
    collections_ids?: string[];
  };
  sort?: string;
}

export interface GetTransactionsOptions {
  filter?: {
    search_query?: string;
  };
  page?: {
    size?: number;
    after?: string;
  };
}

export const backendClient = {
  async getPortfolio(
    address: string,
    options: GetPortfolioOptions = {}
  ): Promise<ApiResponse<Portfolio>> {
    const url = buildUrl(`/api/zerion/wallets/${address}/portfolio`, {
      positions: options.positions,
    });
    return fetchFromBackend<ApiResponse<Portfolio>>(url);
  },

  async getAllPositions(
    address: string,
    options: GetPositionsOptions = {}
  ): Promise<Position[]> {
    const url = buildUrl(`/api/zerion/wallets/${address}/positions/all`, {
      filter: options.filter?.positions,
      trash: options.filter?.trash,
      sort: options.sort,
    });
    return fetchFromBackend<Position[]>(url);
  },

  async getPositions(
    address: string,
    options: GetPositionsOptions = {}
  ): Promise<{
    data: Position[];
    links: { next?: string; prev?: string };
    meta: {
      total_count?: number;
      total_records?: number;
      total_pages?: number;
      current_page?: number;
    };
  }> {
    const url = buildUrl(`/api/zerion/wallets/${address}/positions`, {
      pageSize: options.page?.size,
      filter: options.filter?.positions,
      trash: options.filter?.trash,
      cursor: options.page?.after,
    });
    const response = await fetchFromBackend<{
      data: Position[];
      links: { next?: string; prev?: string };
      meta: {
        total_count?: number;
        total_records?: number;
        total_pages?: number;
        current_page?: number;
      };
    }>(url);
    return response;
  },

  async getAllNFTPositions(
    address: string,
    options: GetNFTPositionsOptions = {}
  ): Promise<NFTPosition[]> {
    const url = buildUrl(`/api/zerion/wallets/${address}/nfts/all`, {
      chainIds: options.filter?.chain_ids?.join(','),
      collectionsIds: options.filter?.collections_ids?.join(','),
      sort: options.sort,
    });
    return fetchFromBackend<NFTPosition[]>(url);
  },

  async getTransactions(
    address: string,
    options: GetTransactionsOptions = {}
  ): Promise<{
    data: Transaction[];
    links: { next?: string; prev?: string };
    meta: {
      total_count?: number;
      total_records?: number;
      total_pages?: number;
      current_page?: number;
    };
  }> {
    const url = buildUrl(`/api/zerion/wallets/${address}/transactions`, {
      pageSize: options.page?.size,
      search: options.filter?.search_query,
      cursor: options.page?.after,
    });
    const response = await fetchFromBackend<{
      data: Transaction[];
      links: { next?: string; prev?: string };
      meta: {
        total_count?: number;
        total_records?: number;
        total_pages?: number;
        current_page?: number;
      };
    }>(url);
    return response;
  },
};
