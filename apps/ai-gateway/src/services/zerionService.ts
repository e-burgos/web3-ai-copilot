import ZerionSDK from 'zerion-sdk-ts';
import type {
  ApiResponse,
  Position,
  NFTPosition,
  Transaction,
} from 'zerion-sdk-ts';
import { logger } from '../utils/logger';

if (!process.env.ZERION_API_KEY) {
  throw new Error(
    'ZERION_API_KEY environment variable is required. Please set it in your .env file.'
  );
}

const zerion = new ZerionSDK({
  apiKey: process.env.ZERION_API_KEY,
  timeout: 30000,
  retries: 0,
});

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

class ZerionService {
  async getPortfolio(
    address: string,
    options: GetPortfolioOptions = {}
  ): Promise<ApiResponse<unknown>> {
    const startTime = Date.now();
    try {
      logger.debug('Calling Zerion API: getPortfolio', { address, options });
      const response = await zerion.wallets.getPortfolio(address, {
        positions: options.positions || 'no_filter',
      });
      const duration = Date.now() - startTime;
      logger.info('Zerion API call successful: getPortfolio', {
        address,
        duration: `${duration}ms`,
      });
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Zerion API call failed: getPortfolio', {
        address,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`,
      });
      throw new Error(
        `Failed to fetch portfolio for address ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getAllPositions(
    address: string,
    options: GetPositionsOptions = {}
  ): Promise<Position[]> {
    try {
      const result = await zerion.wallets.getAllPositions(address, {
        filter: {
          positions: options.filter?.positions || 'no_filter',
          trash: options.filter?.trash || 'only_non_trash',
          chain_ids: options.filter?.chain_ids || [],
        },
        sort: (options.sort || 'value') as 'value',
      });
      return result;
    } catch (error) {
      throw new Error(
        `Failed to fetch all positions for address ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

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
    try {
      const pageData = await zerion.wallets.getPositions(address, {
        filter: {
          positions: options.filter?.positions || 'no_filter',
          trash: options.filter?.trash || 'only_non_trash',
          chain_ids: options.filter?.chain_ids || [],
        },
        sort: (options.sort || 'value') as 'value',
        page: {
          size: options.page?.size || 100,
          ...(options.page?.after ? { after: options.page.after } : {}),
        },
      });

      return {
        data: pageData.data || [],
        links: pageData.links || {},
        meta: pageData.meta || {},
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch positions for address ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getAllNFTPositions(
    address: string,
    options: GetNFTPositionsOptions = {}
  ): Promise<NFTPosition[]> {
    try {
      const result = await zerion.wallets.getAllNFTPositions(address, {
        filter: {
          chain_ids: options.filter?.chain_ids || [],
          collections_ids: options.filter?.collections_ids || [],
        },
        // @ts-expect-error - sort may not be in getAllNFTPositions type definition
        sort: options.sort,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Failed to fetch all NFT positions for address ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

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
    try {
      const pageData = await zerion.wallets.getTransactions(address, {
        filter: {
          search_query: options.filter?.search_query || '',
        },
        page: {
          size: options.page?.size || 10,
          ...(options.page?.after ? { after: options.page.after } : {}),
        },
      });

      return {
        data: pageData.data || [],
        links: pageData.links || {},
        meta: pageData.meta || {},
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch transactions for address ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export const zerionService = new ZerionService();
