import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';

import { disconnectMongo } from './mongodb.js';

import type { ProxyEntity } from '@/domain/entities/proxy.entity.js';

export type DatabaseSchema = {
  proxies: ProxyEntity[];
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const isSrc = currentDir.endsWith('config');
const rootDir = isSrc ? join(currentDir, '..', '..') : join(currentDir, '..');
const defaultPath = join(rootDir, 'config.json');

export const connectDatabase = (
  filePath = process.env.CONFIG_PATH || defaultPath,
) => JSONFilePreset<DatabaseSchema>(filePath, { proxies: [] });

export const disconnectDatabase = async (): Promise<void> => {
  if (process.env.DATABASE_DRIVER === 'mongodb') {
    await disconnectMongo();
  }
};

export const db: Low<DatabaseSchema> = process.env.DATABASE_DRIVER === 'mongodb'
  ? (null as unknown as Low<DatabaseSchema>)
  : await connectDatabase();
