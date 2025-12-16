import { Router } from 'express';
import { z } from 'zod';
import { zerionController } from '../controllers/zerionController';

const router = Router();

// Validation schemas
const addressParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

const portfolioQuerySchema = z.object({
  positions: z
    .enum(['no_filter', 'only_simple', 'only_complex'])
    .optional()
    .default('no_filter'),
});

const positionsQuerySchema = z.object({
  pageSize: z.string().regex(/^\d+$/).optional(),
  pageIndex: z.string().regex(/^\d+$/).optional(),
  filter: z
    .enum(['no_filter', 'only_simple', 'only_complex'])
    .optional()
    .default('no_filter'),
  trash: z
    .enum(['no_filter', 'only_trash', 'only_non_trash'])
    .optional()
    .default('only_non_trash'),
  sort: z.enum(['value', 'name', 'chain']).optional().default('value'),
  cursor: z.string().optional(),
});

const allPositionsQuerySchema = z.object({
  filter: z
    .enum(['no_filter', 'only_simple', 'only_complex'])
    .optional()
    .default('no_filter'),
  trash: z
    .enum(['no_filter', 'only_trash', 'only_non_trash'])
    .optional()
    .default('only_non_trash'),
  sort: z.enum(['value', 'name', 'chain']).optional().default('value'),
});

const nftsQuerySchema = z.object({
  chainIds: z.string().optional(),
  collectionsIds: z.string().optional(),
  sort: z.string().optional(),
});

const transactionsQuerySchema = z.object({
  pageSize: z.string().regex(/^\d+$/).optional(),
  search: z.string().optional().default(''),
  cursor: z.string().optional(),
});

/**
 * @swagger
 * /api/zerion/wallets/{address}/portfolio:
 *   get:
 *     summary: Get wallet portfolio
 *     description: Get portfolio overview for a wallet address
 *     tags: [Zerion]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *       - in: query
 *         name: positions
 *         schema:
 *           type: string
 *           enum: [no_filter, only_simple, only_complex]
 *         description: Filter positions by type
 *     responses:
 *       200:
 *         description: Portfolio data
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/wallets/:address/portfolio',
  (req, res, next) => {
    try {
      addressParamSchema.parse(req.params);
      portfolioQuerySchema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid parameters',
      });
      return;
    }
  },
  zerionController.getPortfolio
);

/**
 * @swagger
 * /api/zerion/wallets/{address}/positions/all:
 *   get:
 *     summary: Get all wallet positions
 *     description: Get all positions (tokens) for a wallet address without pagination
 *     tags: [Zerion]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [no_filter, only_simple, only_complex]
 *       - in: query
 *         name: trash
 *         schema:
 *           type: string
 *           enum: [no_filter, only_trash, only_non_trash]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [value, name, chain]
 *     responses:
 *       200:
 *         description: All positions data
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/wallets/:address/positions/all',
  (req, res, next) => {
    try {
      addressParamSchema.parse(req.params);
      allPositionsQuerySchema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid parameters',
      });
      return;
    }
  },
  zerionController.getAllPositions
);

/**
 * @swagger
 * /api/zerion/wallets/{address}/positions:
 *   get:
 *     summary: Get wallet positions (paginated)
 *     description: Get positions for a wallet address with pagination support
 *     tags: [Zerion]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [no_filter, only_simple, only_complex]
 *       - in: query
 *         name: trash
 *         schema:
 *           type: string
 *           enum: [no_filter, only_trash, only_non_trash]
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Pagination cursor
 *     responses:
 *       200:
 *         description: Paginated positions data
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/wallets/:address/positions',
  (req, res, next) => {
    try {
      addressParamSchema.parse(req.params);
      positionsQuerySchema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid parameters',
      });
      return;
    }
  },
  zerionController.getPositions
);

/**
 * @swagger
 * /api/zerion/wallets/{address}/nfts/all:
 *   get:
 *     summary: Get all wallet NFT positions
 *     description: Get all NFT positions for a wallet address
 *     tags: [Zerion]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *       - in: query
 *         name: chainIds
 *         schema:
 *           type: string
 *         description: Comma-separated chain IDs
 *       - in: query
 *         name: collectionsIds
 *         schema:
 *           type: string
 *         description: Comma-separated collection IDs
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All NFT positions data
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/wallets/:address/nfts/all',
  (req, res, next) => {
    try {
      addressParamSchema.parse(req.params);
      nftsQuerySchema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid parameters',
      });
      return;
    }
  },
  zerionController.getAllNFTPositions
);

/**
 * @swagger
 * /api/zerion/wallets/{address}/transactions:
 *   get:
 *     summary: Get wallet transactions (paginated)
 *     description: Get transactions for a wallet address with pagination support
 *     tags: [Zerion]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Ethereum wallet address
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Pagination cursor
 *     responses:
 *       200:
 *         description: Paginated transactions data
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/wallets/:address/transactions',
  (req, res, next) => {
    try {
      addressParamSchema.parse(req.params);
      transactionsQuerySchema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid parameters',
      });
      return;
    }
  },
  zerionController.getTransactions
);

export { router as zerionRoutes };
