import { Router } from 'express';

export const providersRoutes = Router();

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get available AI providers
 *     description: Returns a list of available AI providers based on configured API keys
 *     tags: [Providers]
 *     security: []
 *     responses:
 *       200:
 *         description: List of available providers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "groq"
 *                       available:
 *                         type: boolean
 *                         example: true
 *                       models:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
 */
// Helper function to check if an environment variable is set and not empty
const isEnvVarSet = (key: string | undefined): boolean => {
  return !!key && key.trim().length > 0;
};

providersRoutes.get('/', (_req, res) => {
  const providers = {
    providers: [
      {
        name: 'groq',
        available: isEnvVarSet(process.env.GROQ_API_KEY),
        models: [
          // Production Models
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'openai/gpt-oss-120b',
          'openai/gpt-oss-20b',
          // Production Systems (with built-in tools)
          'groq/compound',
          'groq/compound-mini',
          // Preview Models (for evaluation)
          'meta-llama/llama-4-maverick-17b-128e-instruct',
          'meta-llama/llama-4-scout-17b-16e-instruct',
          'moonshotai/kimi-k2-instruct-0905',
          'openai/gpt-oss-safeguard-20b',
          'qwen/qwen3-32b',
        ],
      },
      {
        name: 'openai',
        available: isEnvVarSet(process.env.OPENAI_API_KEY),
        models: [
          // Most economical models
          'gpt-4o-mini', // Most economical GPT-4o model
          'gpt-4o-mini-2024-07-18',
          'gpt-3.5-turbo', // Most economical overall
          'gpt-3.5-turbo-0125',
          'gpt-3.5-turbo-1106',
        ],
      },
      {
        name: 'anthropic',
        available: isEnvVarSet(process.env.ANTHROPIC_API_KEY),
        models: ['claude-3-opus-20240229'],
      },
      {
        name: 'llama',
        available: isEnvVarSet(process.env.LLAMA_API_KEY),
        models: ['llama-2-70b-chat'],
      },
    ],
  };

  res.json(providers);
});
