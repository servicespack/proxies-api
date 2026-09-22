import { cooldown, logger } from './config/index.js';
import { server } from './infrastructure/http/server.js';

async function main() {
  const { PORT = 3000 } = process.env;

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`));

  cooldown({ server });
}

main();
