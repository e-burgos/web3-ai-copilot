import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { z } from 'zod';

const portfolioAnalysisSchema = z.object({
  portfolioData: z.object({
    totalValue: z.number(),
    tokens: z.array(
      z.object({
        symbol: z.string(),
        name: z.string(),
        value: z.number(),
        priceChange24h: z.number(),
      })
    ),
  }),
  provider: z.enum(['openai', 'anthropic', 'llama']).optional(),
});

export const portfolioAnalysisRoutes = Router();

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

