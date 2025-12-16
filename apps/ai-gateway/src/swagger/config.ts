import type { SwaggerDefinition } from 'swagger-jsdoc';
import { healthPaths } from './paths/health';
import { chatPaths } from './paths/chat';
import { portfolioAnalysisPaths } from './paths/portfolio-analysis';
import { zerionPaths } from './paths/zerion';
import { schemas } from './schemas';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
const renderUrl = process.env.RENDER_EXTERNAL_URL || process.env.RENDER_URL;

export const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Web3 AI Copilot API',
    version: '1.0.0',
    description:
      'AI-powered Web3 portfolio analysis and chat API with Zerion integration',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: baseUrl,
      description: 'Development server',
    },
    ...(renderUrl
      ? [
          {
            url: renderUrl,
            description: 'Production server',
          },
        ]
      : []),
  ],
  paths: {
    ...healthPaths,
    ...chatPaths,
    ...portfolioAnalysisPaths,
    ...zerionPaths,
  },
  components: {
    schemas,
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Bearer token or Basic auth for API access',
      },
    },
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Chat',
      description: 'AI chat endpoints for portfolio analysis',
    },
    {
      name: 'Portfolio Analysis',
      description: 'AI-powered portfolio analysis endpoints',
    },
    {
      name: 'Zerion',
      description: 'Zerion API proxy endpoints for wallet data',
    },
  ],
};
