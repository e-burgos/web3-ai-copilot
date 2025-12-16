import { server } from './server';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info('AI Gateway server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });
});
