import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { z } from 'zod';
import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks/types-only';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  portfolioData: z
    .object({
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
      nfts: z
        .array(
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
        )
        .optional(),
      defiPositions: z
        .array(
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
        )
        .optional(),
      recentTransactions: z
        .array(
          z.object({
            id: z.string(),
            hash: z.string(),
            operation_type: z.string(),
            mined_at: z.union([z.number(), z.string()]),
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
        )
        .optional(),
    })
    .optional(),
  provider: z.enum(['openai', 'anthropic', 'llama', 'groq']).optional(),
  model: z.string().optional(),
});

export const chatRoutes = Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with AI assistant
 *     description: Send messages to an AI assistant for Web3 portfolio analysis and advice
 *     tags: [Chat]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Message'
 *                 description: Array of chat messages
 *                 example:
 *                   - role: "user"
 *                     content: "Analyze my portfolio performance"
 *                   - role: "assistant"
 *                     content: "I'd be happy to help analyze your portfolio."
 *               portfolioData:
 *                 type: object
 *                 description: Portfolio data for context-aware responses (optional)
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Wallet address
 *                   portfolio:
 *                     type: object
 *                     description: Portfolio summary data
 *                   tokens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         symbol:
 *                           type: string
 *                         name:
 *                           type: string
 *                         balance:
 *                           type: string
 *                         value:
 *                           type: number
 *                         price:
 *                           type: number
 *                         priceChange24h:
 *                           type: number
 *                         logo:
 *                           type: string
 *                         chainId:
 *                           type: number
 *                   nfts:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         collection:
 *                           type: string
 *                         chainId:
 *                           type: number
 *                         value:
 *                           type: number
 *                         price:
 *                           type: number
 *                   defiPositions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         tokenName:
 *                           type: string
 *                         tokenSymbol:
 *                           type: string
 *                         protocol:
 *                           type: string
 *                         type:
 *                           type: string
 *                         chainId:
 *                           type: number
 *                         value:
 *                           type: number
 *                         price:
 *                           type: number
 *                         apy:
 *                           type: number
 *                   recentTransactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         hash:
 *                           type: string
 *                         operation_type:
 *                           type: string
 *                         mined_at:
 *                           type: number
 *                         sent_from:
 *                           type: string
 *                         sent_to:
 *                           type: string
 *                         fee:
 *                           type: number
 *                         transfers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               fungible_info:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                   symbol:
 *                                     type: string
 *                               quantity:
 *                                 type: string
 *                               value:
 *                                 type: number
 *               provider:
 *                 type: string
 *                 enum: [openai, anthropic, llama, groq]
 *                 default: openai
 *                 description: AI provider to use. If not specified, defaults to Groq if GROQ_API_KEY is available, otherwise OpenAI.
 *               model:
 *                 type: string
 *                 description: Specific model to use for the selected provider. If not specified, uses the default model for the provider.
 *                 example: "gpt-4o-mini"
 *             required:
 *               - messages
 *     responses:
 *       200:
 *         description: Successful chat response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *       400:
 *         description: Bad request - invalid input
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
chatRoutes.post('/', async (req, res, next) => {
  try {
    const validatedData = chatSchema.parse(req.body);

    // Transform portfolioData if provided
    let portfolioData: ContextPortfolioData | undefined;
    if (validatedData.portfolioData) {
      portfolioData = {
        address: validatedData.portfolioData.address,
        portfolio: validatedData.portfolioData.portfolio ?? undefined,
        tokens: validatedData.portfolioData.tokens,
        nfts: validatedData.portfolioData.nfts,
        defiPositions: validatedData.portfolioData.defiPositions,
        recentTransactions: validatedData.portfolioData.recentTransactions?.map(
          (tx) => ({
            id: tx.id,
            hash: tx.hash,
            operation_type: tx.operation_type,
            mined_at:
              typeof tx.mined_at === 'number'
                ? tx.mined_at
                : new Date(tx.mined_at).getTime(),
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
    }

    const response = await aiController.chat(
      validatedData.messages,
      validatedData.provider,
      portfolioData,
      validatedData.model
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});
