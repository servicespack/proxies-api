import type http from 'node:http';

import { logger } from './logger.js';

export function cooldown({ server }: { server: http.Server }): void {
  const close = (code: number) => () => {
    logger.info('Shutting down Node Proxy');
    server.close(() => {
      process.exit(code);
    });
  };

  process.on('SIGHUP', close(128 + 1));
  process.on('SIGINT', close(128 + 2));
  process.on('SIGTERM', close(128 + 15));
}

export default cooldown;
