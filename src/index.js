import { cooldown } from './cooldown.js';
import { db } from './db.js';
import { logger } from './logger.js';
import { server } from './server.js';

async function main() {
  const { PORT = 3000 } = process.env;

  await db.read();
  db.data ||= { proxies: [] };
  await db.write();

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`));

  process
    .on('SIGTERM', cooldown)
    .on('SIGHUP', cooldown)
    .on('SIGINT', cooldown);
}

main();
