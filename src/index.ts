import { logger } from './config/index.js';
import { server } from './infrastructure/http/server.js';
import { setupGracefulShutdown } from './infrastructure/process/graceful-shutdown.js';

async function main() {
  const { PORT = 3000 } = process.env;

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`));

  setupGracefulShutdown([
    () => new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  ]);
}

main();
