import { Request, Response } from 'express';
import { zerionService } from '../services/zerionService';
import { cacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

export const zerionController = {
  async getPortfolio(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { positions } = req.query;

      if (!address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Address parameter is required',
        });
      }

      const options = {
        positions:
          (positions as 'no_filter' | 'only_simple' | 'only_complex') ||
          'no_filter',
      };

      // Check cache first
      const cacheKey = 'portfolio';
      const cached = cacheService.get(cacheKey, address, options);
      if (cached) {
        logger.debug('Returning cached portfolio data', { address });
        return res.json(cached);
      }

      // Fetch from Zerion
      const response = await zerionService.getPortfolio(address, options);

      // Cache the response
      cacheService.set(cacheKey, address, response, options);

      return res.json(response);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : 'Failed to fetch portfolio',
      });
    }
  },

  async getAllPositions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { filter, trash, sort } = req.query;

      if (!address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Address parameter is required',
        });
      }

      const options = {
        filter: {
          positions:
            (filter as 'no_filter' | 'only_simple' | 'only_complex') ||
            'no_filter',
          trash:
            (trash as 'no_filter' | 'only_trash' | 'only_non_trash') ||
            'only_non_trash',
        },
        sort: (sort as 'value' | 'name' | 'chain') || 'value',
      };

      // Check cache
      const cacheKey = 'allPositions';
      const cached = cacheService.get(cacheKey, address, options);
      if (cached) {
        logger.debug('Returning cached all positions data', { address });
        return res.json(cached);
      }

      const result = await zerionService.getAllPositions(address, options);

      // Cache the response
      cacheService.set(cacheKey, address, result, options);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch all positions',
      });
    }
  },

  async getPositions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { pageSize, filter, trash, cursor } = req.query;

      if (!address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Address parameter is required',
        });
      }

      const options = {
        filter: {
          positions:
            (filter as 'no_filter' | 'only_simple' | 'only_complex') ||
            'no_filter',
          trash:
            (trash as 'no_filter' | 'only_trash' | 'only_non_trash') ||
            'only_non_trash',
        },
        sort: 'value' as const,
        page: {
          size: pageSize ? parseInt(pageSize as string, 10) : 100,
          ...(cursor ? { after: cursor as string } : {}),
        },
      };

      const result = await zerionService.getPositions(address, options);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : 'Failed to fetch positions',
      });
    }
  },

  async getAllNFTPositions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { chainIds, collectionsIds, sort } = req.query;

      if (!address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Address parameter is required',
        });
      }

      const options = {
        filter: {
          chain_ids:
            chainIds && typeof chainIds === 'string'
              ? chainIds.split(',').filter(Boolean)
              : [],
          collections_ids:
            collectionsIds && typeof collectionsIds === 'string'
              ? collectionsIds.split(',').filter(Boolean)
              : [],
        },
        sort: sort as string | undefined,
      };

      // Check cache
      const cacheKey = 'allNFTPositions';
      const cached = cacheService.get(cacheKey, address, options);
      if (cached) {
        logger.debug('Returning cached NFT positions data', { address });
        return res.json(cached);
      }

      const result = await zerionService.getAllNFTPositions(address, options);

      // Cache the response
      cacheService.set(cacheKey, address, result, options);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch all NFT positions',
      });
    }
  },

  async getTransactions(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { pageSize, search, cursor } = req.query;

      if (!address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Address parameter is required',
        });
      }

      const options = {
        filter: {
          search_query: (search as string) || '',
        },
        page: {
          size: pageSize ? parseInt(pageSize as string, 10) : 10,
          ...(cursor ? { after: cursor as string } : {}),
        },
      };

      const result = await zerionService.getTransactions(address, options);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch transactions',
      });
    }
  },
};
