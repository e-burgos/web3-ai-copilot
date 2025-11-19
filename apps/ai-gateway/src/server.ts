import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { chatRoutes } from './routes/chat';
import { portfolioAnalysisRoutes } from './routes/portfolio-analysis';
import { errorHandler } from './middleware/errorHandler';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Web3 AI Copilot API',
      version: '1.0.0',
      description: 'AI-powered Web3 portfolio analysis and chat API',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          description: 'Check if the API server is running and healthy',
          tags: ['Health'],
          security: [],
          responses: {
            200: {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok',
                      },
                    },
                    required: ['status'],
                  },
                },
              },
            },
          },
        },
      },
      '/api/chat': {
        post: {
          summary: 'Chat with AI assistant',
          description: 'Send messages to an AI assistant for Web3 portfolio analysis and advice',
          tags: ['Chat'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    messages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          role: {
                            type: 'string',
                            enum: ['user', 'assistant', 'system'],
                            example: 'user',
                          },
                          content: {
                            type: 'string',
                            example: 'Analyze my portfolio performance',
                          },
                        },
                        required: ['role', 'content'],
                      },
                    },
                    provider: {
                      type: 'string',
                      enum: ['openai', 'anthropic', 'llama'],
                      default: 'openai',
                      description: 'AI provider to use',
                    },
                  },
                  required: ['messages'],
                },
                example: {
                  messages: [
                    { role: 'user', content: 'Analyze my portfolio performance' },
                    { role: 'assistant', content: "I'd be happy to help analyze your portfolio." },
                  ],
                  provider: 'openai',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful chat response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      content: {
                        type: 'string',
                        example: 'Based on your portfolio analysis...',
                      },
                      usage: {
                        type: 'object',
                        properties: {
                          promptTokens: { type: 'number', example: 150 },
                          completionTokens: { type: 'number', example: 200 },
                          totalTokens: { type: 'number', example: 350 },
                        },
                      },
                    },
                    required: ['content'],
                  },
                },
              },
            },
            400: {
              description: 'Bad request - invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/portfolio-analysis': {
        post: {
          summary: 'Analyze Web3 portfolio',
          description:
            'Get AI-powered analysis of a Web3 portfolio including performance, risk assessment, and optimization suggestions',
          tags: ['Portfolio Analysis'],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    portfolioData: {
                      type: 'object',
                      properties: {
                        totalValue: { type: 'number', example: 12500.5 },
                        tokens: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              symbol: { type: 'string', example: 'ETH' },
                              name: { type: 'string', example: 'Ethereum' },
                              value: { type: 'number', example: 8500.25 },
                              priceChange24h: { type: 'number', example: 2.5 },
                            },
                            required: ['symbol', 'name', 'value', 'priceChange24h'],
                          },
                        },
                      },
                      required: ['totalValue', 'tokens'],
                    },
                    provider: {
                      type: 'string',
                      enum: ['openai', 'anthropic', 'llama'],
                      default: 'openai',
                      description: 'AI provider to use for analysis',
                    },
                  },
                  required: ['portfolioData'],
                },
                example: {
                  portfolioData: {
                    totalValue: 12500.5,
                    tokens: [
                      { symbol: 'ETH', name: 'Ethereum', value: 8500.25, priceChange24h: 2.5 },
                      { symbol: 'USDC', name: 'USD Coin', value: 4000.25, priceChange24h: 0.1 },
                    ],
                  },
                  provider: 'openai',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful portfolio analysis',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      content: {
                        type: 'string',
                        example:
                          'Your portfolio shows strong diversification with 68% in Ethereum and 32% in stablecoins.',
                      },
                      usage: {
                        type: 'object',
                        properties: {
                          promptTokens: { type: 'number', example: 250 },
                          completionTokens: { type: 'number', example: 180 },
                          totalTokens: { type: 'number', example: 430 },
                        },
                      },
                    },
                    required: ['content'],
                  },
                },
              },
            },
            400: {
              description: 'Bad request - invalid portfolio data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            422: {
              description: 'Validation error - malformed request data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal server error' },
            message: { type: 'string', example: 'An unexpected error occurred' },
          },
          required: ['error', 'message'],
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer token or Basic auth for API access',
        },
      },
    },
  },
  apis: [], // No necesitamos archivos JSDoc ya que definimos los paths manualmente
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const server = express();

server.use(cors());
server.use(express.json());

// Swagger UI
server.use('/', swaggerUi.serve);
server.get(
  '/',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

server.use('/api/chat', chatRoutes);
server.use('/api/portfolio-analysis', portfolioAnalysisRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API server is running and healthy
 *     tags: [Health]
 *     security: []  # No authentication required
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *               required:
 *                 - status
 */
server.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

server.use(errorHandler);
