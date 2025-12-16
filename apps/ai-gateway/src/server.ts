import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { chatRoutes } from './routes/chat';
import { portfolioAnalysisRoutes } from './routes/portfolio-analysis';
import { zerionRoutes } from './routes/zerionRoutes';
import { errorHandler } from './middleware/errorHandler';
import {
  zerionRateLimiter,
  aiRateLimiter,
  generalRateLimiter,
} from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './utils/logger';
import { swaggerDefinition } from './swagger/config';

// Swagger configuration
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [], // Using structured Swagger definitions from swagger/ folder
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const server = express();

// CORS configuration
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [];

    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, only allow specified origins
    if (allowedOrigins.length === 0) {
      // If no origins specified, allow all (fallback for backwards compatibility)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));
server.use(express.json());

// Request logging middleware (should be early in the chain)
server.use(requestLogger);

// Apply general rate limiting to all routes
server.use(generalRateLimiter);

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

// Apply specific rate limiters to routes
server.use('/api/chat', aiRateLimiter, chatRoutes);
server.use('/api/portfolio-analysis', aiRateLimiter, portfolioAnalysisRoutes);
server.use('/api/zerion', zerionRateLimiter, zerionRoutes);

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
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  logger.debug('Health check requested', healthData);
  res.json(healthData);
});

server.use(errorHandler);
