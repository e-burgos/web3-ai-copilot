export const schemas = {
  Error: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Internal server error',
      },
      message: {
        type: 'string',
        example: 'An unexpected error occurred',
      },
    },
    required: ['error', 'message'],
  },
  HealthResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'ok',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T12:00:00.000Z',
      },
      uptime: {
        type: 'number',
        example: 3600.5,
        description: 'Server uptime in seconds',
      },
      environment: {
        type: 'string',
        example: 'production',
      },
      memory: {
        type: 'object',
        properties: {
          used: {
            type: 'number',
            example: 45.2,
            description: 'Memory used in MB',
          },
          total: {
            type: 'number',
            example: 128.0,
            description: 'Total memory in MB',
          },
        },
      },
    },
    required: ['status', 'timestamp'],
  },
  ChatMessage: {
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
  ChatRequest: {
    type: 'object',
    properties: {
      messages: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ChatMessage',
        },
      },
      portfolioData: {
        type: 'object',
        description: 'Optional portfolio data for context',
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
  ChatResponse: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        example: 'Based on your portfolio analysis...',
      },
      usage: {
        type: 'object',
        properties: {
          promptTokens: {
            type: 'number',
            example: 150,
          },
          completionTokens: {
            type: 'number',
            example: 200,
          },
          totalTokens: {
            type: 'number',
            example: 350,
          },
        },
      },
    },
    required: ['content'],
  },
  PortfolioAnalysisRequest: {
    type: 'object',
    properties: {
      portfolioData: {
        type: 'object',
        properties: {
          totalValue: {
            type: 'number',
            example: 12500.5,
          },
          tokens: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  example: 'ETH',
                },
                name: {
                  type: 'string',
                  example: 'Ethereum',
                },
                value: {
                  type: 'number',
                  example: 8500.25,
                },
                priceChange24h: {
                  type: 'number',
                  example: 2.5,
                },
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
  EthereumAddress: {
    type: 'string',
    pattern: '^0x[a-fA-F0-9]{40}$',
    example: '0x42b9df65b219b3dd36ff330a4dd8f327a6ada990',
    description: 'Ethereum wallet address',
  },
  ZerionPortfolioResponse: {
    type: 'object',
    description: 'Portfolio data from Zerion API',
  },
  ZerionPositionsResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
      links: {
        type: 'object',
        properties: {
          next: {
            type: 'string',
            nullable: true,
          },
          prev: {
            type: 'string',
            nullable: true,
          },
        },
      },
      meta: {
        type: 'object',
        properties: {
          total_count: {
            type: 'number',
          },
          total_records: {
            type: 'number',
          },
          total_pages: {
            type: 'number',
          },
          current_page: {
            type: 'number',
          },
        },
      },
    },
  },
  ZerionNFTResponse: {
    type: 'array',
    items: {
      type: 'object',
    },
    description: 'Array of NFT positions',
  },
  ZerionTransactionsResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
      links: {
        type: 'object',
        properties: {
          next: {
            type: 'string',
            nullable: true,
          },
          prev: {
            type: 'string',
            nullable: true,
          },
        },
      },
      meta: {
        type: 'object',
      },
    },
  },
};
