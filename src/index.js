import { cooldown } from './cooldown.js';
import { logger } from './logger.js';
import { server } from './server.js';

async function main() {
  const { PORT = 3000 } = process.env;

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`));

  process
    .on('SIGTERM', cooldown)
    .on('SIGHUP', cooldown)
    .on('SIGINT', cooldown);
}

main();
