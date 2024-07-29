import { web } from './application/web.js';
import { logger } from './application/logger.js';
import { port } from './secret.js';

web.listen(port, () => {
  logger.info(`Application started on http://localhost:${port}`);
});
