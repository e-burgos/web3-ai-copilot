import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { z } from 'zod';
import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks/types-only';

const portfolioAnalysisSchema = z.object({
  portfolioData: z.object({
    address: z.string(),
    portfolio: z
      .object({
        positions_distribution_by_type: z.object({
          wallet: z.number(),
          deposited: z.number(),
          borrowed: z.number(),
          locked: z.number(),
          staked: z.number(),
        }),
        positions_distribution_by_chain: z.record(z.string(), z.number()),
        total: z.object({
          positions: z.number(),
        }),
        changes: z.object({
          absolute_1d: z.number(),
          percent_1d: z.number(),
        }),
      })
      .optional(),
    tokens: z.array(
      z.object({
        id: z.string(),
        symbol: z.string(),
        name: z.string(),
        balance: z.string(),
        value: z.number(),
        price: z.number(),
        priceChange24h: z.number(),
        logo: z.string().optional(),
        chainId: z
          .union([z.number(), z.string(), z.null()])
          .optional()
          .transform((val) => {
            if (val === null || val === undefined) return undefined;
            return typeof val === 'string'
              ? parseInt(val, 10) || undefined
              : val;
          }),
      })
    ),
    nfts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        previewImage: z.string().optional(),
        collection: z.string(),
        chainId: z
          .union([z.number(), z.string(), z.null()])
          .transform((val) => {
            if (val === null || val === undefined) return 1;
            return typeof val === 'string' ? parseInt(val, 10) || 1 : val;
          }),
        value: z
          .number()
          .nullable()
          .optional()
          .transform((val) => (val === null ? undefined : val)),
        price: z
          .number()
          .nullable()
          .optional()
          .transform((val) => (val === null ? undefined : val)),
        contractAddress: z.string().optional(),
        tokenId: z.string().optional(),
        interface: z.string().optional(),
      })
    ),
    defiPositions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        tokenName: z.string(),
        tokenSymbol: z.string(),
        protocol: z.string(),
        type: z.string(),
        chainId: z
          .union([z.number(), z.string(), z.null()])
          .transform((val) => {
            if (val === null || val === undefined) return 1;
            return typeof val === 'string' ? parseInt(val, 10) || 1 : val;
          }),
        value: z.number(),
        price: z.number(),
        apy: z
          .number()
          .nullable()
          .optional()
          .transform((val) => (val === null ? undefined : val)),
        poolAddress: z.string().optional(),
        priceChange24h: z
          .number()
          .nullable()
          .optional()
          .transform((val) => (val === null ? undefined : val)),
      })
    ),
    recentTransactions: z.array(
      z.object({
        id: z.string(),
        hash: z.string(),
        operation_type: z.string(),
        mined_at: z.union([z.number(), z.string()]), // Accept both timestamp and ISO string
        sent_from: z.string(),
        sent_to: z.string(),
        fee: z.number(),
        transfers: z.array(
          z.object({
            fungible_info: z
              .object({
                name: z.string(),
                symbol: z.string(),
                icon: z
                  .object({
                    url: z.string(),
                  })
                  .nullable()
                  .optional()
                  .transform((val) => (val === null ? undefined : val)),
              })
              .optional(),
            quantity: z.string(),
            value: z
              .number()
              .nullable()
              .optional()
              .transform((val) => (val === null ? undefined : val)),
            price: z
              .number()
              .nullable()
              .optional()
              .transform((val) => (val === null ? undefined : val)),
          })
        ),
      })
    ),
  }),
  provider: z.enum(['openai', 'anthropic', 'llama', 'groq']).optional(),
});

export const portfolioAnalysisRoutes = Router();

/**
 * @swagger
 * /api/portfolio-analysis:
 *   post:
 *     summary: Analyze Web3 portfolio
 *     description: Get AI-powered analysis of a Web3 portfolio including performance, risk assessment, and optimization suggestions
 *     tags: [Portfolio Analysis]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portfolioData:
 *                 $ref: '#/components/schemas/PortfolioData'
 *               provider:
 *                 type: string
 *                 enum: [openai, anthropic, llama, groq]
 *                 default: openai
 *                 description: AI provider to use for analysis
 *             required:
 *               - portfolioData
 *           example:
 *             portfolioData:
 *               address: "0x1234567890123456789012345678901234567890"
 *               totalValue: 12500.50
 *               tokens:
 *                 - id: "eth-1"
 *                   symbol: "ETH"
 *                   name: "Ethereum"
 *                   balance: "2.5"
 *                   value: 8500.25
 *                   price: 3400.1
 *                   priceChange24h: 2.5
 *                   logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
 *                   chainId: 1
 *                 - id: "usdc-1"
 *                   symbol: "USDC"
 *                   name: "USD Coin"
 *                   balance: "4000"
 *                   value: 4000.25
 *                   price: 1.0
 *                   priceChange24h: 0.1
 *                   chainId: 1
 *               nfts:
 *                 - id: "12345"
 *                   name: "Bored Ape #1234"
 *                   collection: "Bored Ape Yacht Club"
 *                   chainId: 1
 *                   value: 50000
 *                   price: 50000
 *               defiPositions:
 *                 - id: "defi-123"
 *                   name: "ETH/USDC Pool"
 *                   tokenName: "ETH/USDC LP Token"
 *                   tokenSymbol: "ETH-USDC-LP"
 *                   protocol: "Uniswap V3"
 *                   type: "liquidity-pool"
 *                   chainId: 1
 *                   value: 2500
 *                   price: 1.0
 *                   apy: 12.5
 *               recentTransactions:
 *                 - id: "0xabc123"
 *                   operation_type: "swap"
 *                   hash: "0xdef456"
 *                   mined_at: 1705312200000
 *                   sent_from: "0x1111111111111111111111111111111111111111"
 *                   sent_to: "0x2222222222222222222222222222222222222222"
 *                   fee: 5.25
 *                   transfers:
 *                     - fungible_info:
 *                         name: "Ethereum"
 *                         symbol: "ETH"
 *                       quantity: "0.5"
 *                       value: 1700
 *                     - fungible_info:
 *                         name: "USD Coin"
 *                         symbol: "USDC"
 *                       quantity: "1700"
 *                       value: 1700
 *             provider: "openai"
 *     responses:
 *       200:
 *         description: Successful portfolio analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             example:
 *               content: "Your portfolio shows strong diversification with 68% in Ethereum and 32% in stablecoins. The 24h performance is positive at +1.3%. Consider increasing exposure to emerging DeFi protocols for yield optimization."
 *               usage:
 *                 promptTokens: 250
 *                 completionTokens: 180
 *                 totalTokens: 430
 *       400:
 *         description: Bad request - invalid portfolio data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error - malformed request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
portfolioAnalysisRoutes.post('/', async (req, res, next) => {
  try {
    const validatedData = portfolioAnalysisSchema.parse(req.body);
    // Transform the validated data to match ContextPortfolioData type
    const portfolioData: ContextPortfolioData = {
      address: validatedData.portfolioData.address,
      portfolio: validatedData.portfolioData.portfolio ?? undefined,
      tokens: validatedData.portfolioData.tokens,
      nfts: validatedData.portfolioData.nfts,
      defiPositions: validatedData.portfolioData.defiPositions,
      recentTransactions: validatedData.portfolioData.recentTransactions.map(
        (tx) => ({
          id: tx.id,
          hash: tx.hash,
          operation_type: tx.operation_type,
          mined_at:
            typeof tx.mined_at === 'number'
              ? tx.mined_at
              : new Date(tx.mined_at).getTime(), // Convert to milliseconds timestamp
          sent_from: tx.sent_from,
          sent_to: tx.sent_to,
          fee: tx.fee,
          transfers: tx.transfers
            .filter((transfer) => transfer.fungible_info)
            .map((transfer) => ({
              fungible_info: {
                name: transfer.fungible_info!.name,
                symbol: transfer.fungible_info!.symbol,
                icon: transfer.fungible_info!.icon,
              },
              quantity: transfer.quantity,
              value: transfer.value,
              price: transfer.price,
            })),
        })
      ),
    };
    const response = await aiController.analyzePortfolio(
      portfolioData,
      validatedData.provider
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});
