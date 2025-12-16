export const portfolioAnalysisPaths = {
  '/api/portfolio-analysis': {
    post: {
      summary: 'Analyze Web3 portfolio',
      description:
        'Get AI-powered analysis of a Web3 portfolio including performance metrics, risk assessment, diversification analysis, and optimization suggestions.',
      tags: ['Portfolio Analysis'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PortfolioAnalysisRequest',
            },
            example: {
              portfolioData: {
                totalValue: 12500.5,
                tokens: [
                  {
                    symbol: 'ETH',
                    name: 'Ethereum',
                    value: 8500.25,
                    priceChange24h: 2.5,
                  },
                  {
                    symbol: 'USDC',
                    name: 'USD Coin',
                    value: 4000.25,
                    priceChange24h: 0.1,
                  },
                ],
                nfts: [
                  {
                    name: 'Cool NFT #123',
                    collection: 'Cool Collection',
                    value: 500,
                  },
                ],
                defiPositions: [
                  {
                    name: 'Uniswap V3 Position',
                    protocol: 'Uniswap',
                    value: 1000,
                    apy: 12.5,
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
          description: 'Successful portfolio analysis',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChatResponse',
              },
              example: {
                content:
                  'Your portfolio shows strong diversification with 68% in Ethereum and 32% in stablecoins. The 24h performance is positive at +2.5%. I recommend considering...',
                usage: {
                  promptTokens: 250,
                  completionTokens: 180,
                  totalTokens: 430,
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid portfolio data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Bad Request',
                message: 'Portfolio data is required',
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
                message: 'Invalid portfolio data structure',
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
                message: 'Failed to analyze portfolio',
              },
            },
          },
        },
      },
    },
  },
};
