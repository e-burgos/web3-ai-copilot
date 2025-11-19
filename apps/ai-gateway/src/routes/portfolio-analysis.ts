import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { z } from 'zod';

const portfolioAnalysisSchema = z.object({
  portfolioData: z.object({
    address: z.string(),
    totalValue: z.number(),
    tokens: z.array(
      z.object({
        symbol: z.string(),
        name: z.string(),
        balance: z.string(),
        value: z.number(),
        price: z.number(),
        priceChange24h: z.number(),
        logo: z.string().optional(),
      })
    ),
    nfts: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        collection: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
        value: z.number().optional(),
        floorPrice: z.number().optional(),
      })
    ),
    defiPositions: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        name: z.string().optional(),
        protocol: z.string().optional(),
        value: z.number().optional(),
        apy: z.number().optional(),
      })
    ),
    recentTransactions: z.array(
      z.object({
        id: z.string(),
        operation_type: z.string(),
        hash: z.string(),
        mined_at: z.string(),
        transfers: z.array(
          z.object({
            direction: z.string(),
            fungible_info: z
              .object({
                name: z.string().optional(),
                symbol: z.string().optional(),
              })
              .optional(),
            quantity: z.object({
              numeric: z.string(),
            }),
            value: z.number().optional(),
          })
        ),
        fee: z
          .object({
            value: z.number().optional(),
          })
          .optional(),
      })
    ),
  }),
  provider: z.enum(['openai', 'anthropic', 'llama']).optional(),
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
 *                 enum: [openai, anthropic, llama]
 *                 default: openai
 *                 description: AI provider to use for analysis
 *             required:
 *               - portfolioData
 *           example:
 *             portfolioData:
 *               address: "0x1234567890123456789012345678901234567890"
 *               totalValue: 12500.50
 *               tokens:
 *                 - symbol: "ETH"
 *                   name: "Ethereum"
 *                   balance: "2.5"
 *                   value: 8500.25
 *                   price: 3400.1
 *                   priceChange24h: 2.5
 *                   logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
 *                 - symbol: "USDC"
 *                   name: "USD Coin"
 *                   balance: "4000"
 *                   value: 4000.25
 *                   price: 1.0
 *                   priceChange24h: 0.1
 *               nfts:
 *                 - id: "12345"
 *                   name: "Bored Ape #1234"
 *                   collection:
 *                     name: "Bored Ape Yacht Club"
 *                   value: 50000
 *               defiPositions:
 *                 - id: "defi-123"
 *                   type: "liquidity-pool"
 *                   name: "ETH/USDC Pool"
 *                   protocol: "Uniswap V3"
 *                   value: 2500
 *                   apy: 12.5
 *               recentTransactions:
 *                 - id: "0xabc123"
 *                   operation_type: "swap"
 *                   hash: "0xdef456"
 *                   mined_at: "2024-01-15T10:30:00Z"
 *                   transfers:
 *                     - direction: "out"
 *                       fungible_info:
 *                         name: "Ethereum"
 *                         symbol: "ETH"
 *                       quantity:
 *                         numeric: "0.5"
 *                       value: 1700
 *                     - direction: "in"
 *                       fungible_info:
 *                         name: "USD Coin"
 *                         symbol: "USDC"
 *                       quantity:
 *                         numeric: "1700"
 *                       value: 1700
 *                   fee:
 *                     value: 5.25
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
    const response = await aiController.analyzePortfolio(
      validatedData.portfolioData,
      validatedData.provider
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});
