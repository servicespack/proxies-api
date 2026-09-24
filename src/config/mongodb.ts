import { MongoClient, type Db } from 'mongodb';

import { logger } from './logger.js';

let client: MongoClient | null = null;

export const connectMongo = async (
  uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    logger.info('Connected to MongoDB');
  }
  return client;
};

export const getMongoClient = (): MongoClient => {
  if (!client) {
    throw new Error('MongoClient is not connected. Call connectMongo() first.');
  }
  return client;
};

export const getMongoDb = (
  dbName = process.env.MONGODB_DATABASE || 'proxies',
): Db => getMongoClient().db(dbName);

export const disconnectMongo = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    logger.info('Disconnected from MongoDB');
  }
};
