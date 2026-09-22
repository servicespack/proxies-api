import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @returns {import('http').Server}
 */
export const loadServer = async () => {
  const { server } = await import(
    join(__dirname, '..', '..', 'src', `server.ts?time=${Date.now()}`)
  );
  return server;
};
