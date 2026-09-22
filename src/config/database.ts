import { join } from 'node:path';

import { JSONFilePreset } from 'lowdb/node';

import { ProxyEntity } from '../domain/entities/proxy.entity.js';

export type DatabaseSchema = {
  proxies: ProxyEntity[];
};

export const connectDatabase = (
  filePath = process.env.CONFIG_PATH || join(process.cwd(), 'config.json'),
) => JSONFilePreset<DatabaseSchema>(filePath, { proxies: [] });

export const db = await connectDatabase();
