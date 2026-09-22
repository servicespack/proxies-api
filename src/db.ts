import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { JSONFilePreset } from 'lowdb/node';

import { ProxyEntity } from './domain/entities/proxy.entity.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type Schema = {
  proxies: ProxyEntity[]
};

export const db = await JSONFilePreset<Schema>(join(__dirname, '..', 'config.json'), { proxies: [] });
