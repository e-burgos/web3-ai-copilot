export const providersPaths = {
  '/api/providers': {
    get: {
      summary: 'Get available AI providers',
      description:
        'Returns a list of available AI providers and their models based on configured API keys. Only providers with valid API keys will be marked as available.',
      tags: ['Providers'],
      security: [],
      responses: {
        200: {
          description: 'List of available providers and their models',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProvidersResponse',
              },
              example: {
                providers: [
                  {
                    name: 'groq',
                    available: true,
                    models: [
                      'llama-3.3-70b-versatile',
                      'llama-3.1-8b-instant',
                      'openai/gpt-oss-120b',
                      'openai/gpt-oss-20b',
                      'groq/compound',
                      'groq/compound-mini',
                      'meta-llama/llama-4-maverick-17b-128e-instruct',
                      'meta-llama/llama-4-scout-17b-16e-instruct',
                      'moonshotai/kimi-k2-instruct-0905',
                      'openai/gpt-oss-safeguard-20b',
                      'qwen/qwen3-32b',
                    ],
                  },
                  {
                    name: 'openai',
                    available: true,
                    models: [
                      'gpt-4o-mini',
                      'gpt-4o-mini-2024-07-18',
                      'gpt-3.5-turbo',
                      'gpt-3.5-turbo-0125',
                      'gpt-3.5-turbo-1106',
                    ],
                  },
                  {
                    name: 'anthropic',
                    available: false,
                    models: ['claude-3-opus-20240229'],
                  },
                  {
                    name: 'llama',
                    available: false,
                    models: ['llama-2-70b-chat'],
                  },
                ],
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
                message: 'Failed to fetch providers',
              },
            },
          },
        },
      },
    },
  },
};
