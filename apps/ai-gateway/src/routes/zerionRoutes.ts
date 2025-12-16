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
