import express from 'express';
import cors from 'cors';
import { chatRoutes } from './routes/chat';
import { portfolioAnalysisRoutes } from './routes/portfolio-analysis';
import { errorHandler } from './middleware/errorHandler';

export const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/chat', chatRoutes);
server.use('/api/portfolio-analysis', portfolioAnalysisRoutes);

server.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

server.use(errorHandler);

