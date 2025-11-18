/* eslint-disable no-console */
import { server } from './server';

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`AI Gateway server running on port ${PORT}`);
});
