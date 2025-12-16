export const zerionPaths = {
  '/api/zerion/wallets/{address}/portfolio': {
    get: {
      summary: 'Get wallet portfolio',
      description:
        'Get portfolio overview for a wallet address including total value, distribution by type and chain, and 24h changes.',
      tags: ['Zerion'],
      security: [],
      parameters: [
        {
          in: 'path',
          name: 'address',
          required: true,
          schema: {
            $ref: '#/components/schemas/EthereumAddress',
          },
          description: 'Ethereum wallet address',
          example: '0x42b9df65b219b3dd36ff330a4dd8f327a6ada990',
        },
        {
          in: 'query',
          name: 'positions',
          schema: {
            type: 'string',
            enum: ['no_filter', 'only_simple', 'only_complex'],
            default: 'no_filter',
          },
          description: 'Filter positions by type',
        },
      ],
      responses: {
        200: {
          description: 'Portfolio data retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ZerionPortfolioResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid address or parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                error: 'Bad Request',
                message: 'Address parameter is required',
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
                message: 'Failed to fetch portfolio',
              },
            },
          },
        },
      },
    },
  },
  '/api/zerion/wallets/{address}/positions/all': {
    get: {
      summary: 'Get all wallet positions',
      description:
        'Get all token positions for a wallet address without pagination. Returns all tokens across all chains.',
      tags: ['Zerion'],
      security: [],
      parameters: [
        {
          in: 'path',
          name: 'address',
          required: true,
          schema: {
            $ref: '#/components/schemas/EthereumAddress',
          },
          description: 'Ethereum wallet address',
        },
        {
          in: 'query',
          name: 'filter',
          schema: {
            type: 'string',
            enum: ['no_filter', 'only_simple', 'only_complex'],
            default: 'no_filter',
          },
          description: 'Filter positions by type',
        },
        {
          in: 'query',
          name: 'trash',
          schema: {
            type: 'string',
            enum: ['no_filter', 'only_trash', 'only_non_trash'],
            default: 'only_non_trash',
          },
          description: 'Filter by trash status',
        },
        {
          in: 'query',
          name: 'sort',
          schema: {
            type: 'string',
            enum: ['value', 'name', 'chain'],
            default: 'value',
          },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'All positions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request',
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
  '/api/zerion/wallets/{address}/positions': {
    get: {
      summary: 'Get wallet positions (paginated)',
      description:
        'Get token positions for a wallet address with pagination support. Use cursor-based pagination for efficient data retrieval.',
      tags: ['Zerion'],
      security: [],
      parameters: [
        {
          in: 'path',
          name: 'address',
          required: true,
          schema: {
            $ref: '#/components/schemas/EthereumAddress',
          },
          description: 'Ethereum wallet address',
        },
        {
          in: 'query',
          name: 'pageSize',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 100,
          },
          description: 'Number of items per page',
        },
        {
          in: 'query',
          name: 'filter',
          schema: {
            type: 'string',
            enum: ['no_filter', 'only_simple', 'only_complex'],
            default: 'no_filter',
          },
          description: 'Filter positions by type',
        },
        {
          in: 'query',
          name: 'trash',
          schema: {
            type: 'string',
            enum: ['no_filter', 'only_trash', 'only_non_trash'],
            default: 'only_non_trash',
          },
          description: 'Filter by trash status',
        },
        {
          in: 'query',
          name: 'cursor',
          schema: {
            type: 'string',
          },
          description: 'Pagination cursor from previous response',
        },
      ],
      responses: {
        200: {
          description: 'Paginated positions data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ZerionPositionsResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request',
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
  '/api/zerion/wallets/{address}/nfts/all': {
    get: {
      summary: 'Get all wallet NFT positions',
      description:
        'Get all NFT positions for a wallet address. Supports filtering by chain and collection.',
      tags: ['Zerion'],
      security: [],
      parameters: [
        {
          in: 'path',
          name: 'address',
          required: true,
          schema: {
            $ref: '#/components/schemas/EthereumAddress',
          },
          description: 'Ethereum wallet address',
        },
        {
          in: 'query',
          name: 'chainIds',
          schema: {
            type: 'string',
          },
          description: 'Comma-separated chain IDs to filter by',
          example: 'ethereum,arbitrum',
        },
        {
          in: 'query',
          name: 'collectionsIds',
          schema: {
            type: 'string',
          },
          description: 'Comma-separated collection IDs to filter by',
        },
        {
          in: 'query',
          name: 'sort',
          schema: {
            type: 'string',
          },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'All NFT positions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ZerionNFTResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request',
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
  '/api/zerion/wallets/{address}/transactions': {
    get: {
      summary: 'Get wallet transactions (paginated)',
      description:
        'Get transaction history for a wallet address with pagination support. Supports search functionality.',
      tags: ['Zerion'],
      security: [],
      parameters: [
        {
          in: 'path',
          name: 'address',
          required: true,
          schema: {
            $ref: '#/components/schemas/EthereumAddress',
          },
          description: 'Ethereum wallet address',
        },
        {
          in: 'query',
          name: 'pageSize',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of items per page',
        },
        {
          in: 'query',
          name: 'search',
          schema: {
            type: 'string',
            default: '',
          },
          description: 'Search query to filter transactions',
        },
        {
          in: 'query',
          name: 'cursor',
          schema: {
            type: 'string',
          },
          description: 'Pagination cursor from previous response',
        },
      ],
      responses: {
        200: {
          description: 'Paginated transactions data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ZerionTransactionsResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request',
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
};
