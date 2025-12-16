export const healthPaths = {
  '/health': {
    get: {
      summary: 'Health check',
      description:
        'Check if the API server is running and healthy. Returns server status, uptime, and memory usage.',
      tags: ['Health'],
      security: [],
      responses: {
        200: {
          description: 'Server is healthy',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResponse',
              },
              example: {
                status: 'ok',
                timestamp: '2024-01-01T12:00:00.000Z',
                uptime: 3600.5,
                environment: 'production',
                memory: {
                  used: 45.2,
                  total: 128.0,
                },
              },
            },
          },
        },
      },
    },
  },
};
