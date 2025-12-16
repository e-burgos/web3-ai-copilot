export const chatPaths = {
  '/api/chat': {
    post: {
      summary: 'Chat with AI assistant',
      description:
        'Send messages to an AI assistant for Web3 portfolio analysis and advice. The AI can analyze your portfolio data and provide personalized recommendations.',
      tags: ['Chat'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChatRequest',
            },
            example: {
              messages: [
                {
                  role: 'user',
                  content: 'Analyze my portfolio performance',
                },
                {
                  role: 'assistant',
                  content: "I'd be happy to help analyze your portfolio.",
                },
              ],
              portfolioData: {
                address: '0x42b9df65b219b3dd36ff330a4dd8f327a6ada990',
                totalValue: 12500.5,
                tokens: [
                  {
                    symbol: 'ETH',
                    name: 'Ethereum',
                    value: 8500.25,
                    priceChange24h: 2.5,
                  },
                ],
              },
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
                $ref: '#/components/schemas/ChatResponse',
              },
              example: {
                content:
                  'Based on your portfolio analysis, your portfolio shows strong diversification with 68% in Ethereum and 32% in stablecoins. I recommend...',
                usage: {
                  promptTokens: 150,
                  completionTokens: 200,
                  totalTokens: 350,
                },
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
              example: {
                error: 'Bad Request',
                message: 'Invalid message format',
              },
            },
          },
        },
        422: {
          description: 'Validation error - malformed request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Validation Error',
                message: 'Messages array is required',
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
              example: {
                error: 'Internal Server Error',
                message: 'Failed to process chat request',
              },
            },
          },
        },
      },
    },
  },
};
