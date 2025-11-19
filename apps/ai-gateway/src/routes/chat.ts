import { Router } from 'express';
import { aiController } from '../controllers/aiController';

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
 *                 description: Portfolio data for context-aware responses
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Wallet address
 *                   totalValue:
 *                     type: number
 *                     description: Total portfolio value in USD
 *                   tokens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
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
 *                   nfts:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         value:
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
 *                         protocol:
 *                           type: string
 *                         value:
 *                           type: number
 *                         apy:
 *                           type: number
 *                   recentTransactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         operation_type:
 *                           type: string
 *                         transfers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               direction:
 *                                 type: string
 *                               value:
 *                                 type: number
 *               provider:
 *                 type: string
 *                 enum: [openai, anthropic, llama]
 *                 default: openai
 *                 description: AI provider to use
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
    const { messages, provider, portfolioData } = req.body;
    const response = await aiController.chat(messages, provider, portfolioData);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

