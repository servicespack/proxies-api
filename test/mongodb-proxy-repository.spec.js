import { faker } from '@faker-js/faker';

import { clearMongoDb, setupMongoMemory, teardownMongoMemory } from './helpers/load-mongo.js';

import { getMongoDb } from '@/config/mongodb.js';
import { ProxyEntity } from '@/domain/entities/proxy.entity.js';
import { MongoDbProxyRepository } from '@/infrastructure/database/mongodb/repositories/mongodb-proxy.repository.js';

describe('MongoDbProxyRepository (in-memory)', () => {
  /**
   * @type {MongoDbProxyRepository}
   */
  let repository;

  beforeAll(async () => {
    await setupMongoMemory();
  });

  afterAll(async () => {
    await teardownMongoMemory();
  });

  beforeEach(async () => {
    await clearMongoDb();
    const collection = getMongoDb().collection('proxies');
    repository = new MongoDbProxyRepository(collection);
  });

  describe('create', () => {
    it('should insert proxy document and return entity', async () => {
      const proxy = new ProxyEntity({
        namespace: faker.internet.domainWord(),
        target: faker.internet.url(),
      });

      const result = await repository.create(proxy);

      expect(result).toBe(proxy);

      const found = await repository.findById(proxy.id);
      expect(found).toBeInstanceOf(ProxyEntity);
      expect(found?.id).toBe(proxy.id);
      expect(found?.namespace).toBe(proxy.namespace);
      expect(found?.target).toBe(proxy.target);
    });
  });

  describe('findAll', () => {
    it('should return all proxies mapped to entities', async () => {
      const proxy1 = new ProxyEntity({
        namespace: 'service-a',
        target: 'https://service-a.local',
      });
      const proxy2 = new ProxyEntity({
        namespace: 'service-b',
        target: 'https://service-b.local',
      });

      await repository.create(proxy1);
      await repository.create(proxy2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ProxyEntity);
      expect(result.some((p) => p.namespace === proxy1.namespace)).toBe(true);
      expect(result.some((p) => p.namespace === proxy2.namespace)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return the proxy when found by id', async () => {
      const proxy = new ProxyEntity({
        namespace: 'service-a',
        target: 'https://service-a.local',
      });
      await repository.create(proxy);

      const result = await repository.findById(proxy.id);

      expect(result).toBeInstanceOf(ProxyEntity);
      expect(result?.id).toBe(proxy.id);
      expect(result?.namespace).toBe(proxy.namespace);
      expect(result?.target).toBe(proxy.target);
    });

    it('should return undefined when proxy is not found', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('findByNamespace', () => {
    it('should return the proxy when found by namespace', async () => {
      const proxy = new ProxyEntity({
        namespace: 'my-namespace',
        target: 'https://my-service.local',
      });
      await repository.create(proxy);

      const result = await repository.findByNamespace('my-namespace');

      expect(result).toBeInstanceOf(ProxyEntity);
      expect(result?.id).toBe(proxy.id);
      expect(result?.namespace).toBe('my-namespace');
    });

    it('should return undefined when namespace is not found', async () => {
      const result = await repository.findByNamespace('unknown');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return the updated proxy entity', async () => {
      const proxy = new ProxyEntity({
        namespace: 'old-namespace',
        target: 'https://old-target.local',
      });
      await repository.create(proxy);

      const updated = await repository.update(proxy.id, {
        target: 'https://new-target.local',
      });

      expect(updated).toBeInstanceOf(ProxyEntity);
      expect(updated?.id).toBe(proxy.id);
      expect(updated?.target).toBe('https://new-target.local');
      expect(updated?.namespace).toBe('old-namespace');

      const found = await repository.findById(proxy.id);
      expect(found?.target).toBe('https://new-target.local');
    });

    it('should return undefined when proxy to update does not exist', async () => {
      const result = await repository.update('non-existent-id', {
        target: 'https://new-target.local',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted proxy entity', async () => {
      const proxy = new ProxyEntity({
        namespace: 'to-delete',
        target: 'https://delete-me.local',
      });
      await repository.create(proxy);

      const deleted = await repository.delete(proxy.id);

      expect(deleted).toBeInstanceOf(ProxyEntity);
      expect(deleted?.id).toBe(proxy.id);

      const findAfter = await repository.findById(proxy.id);
      expect(findAfter).toBeUndefined();
    });

    it('should return undefined when proxy to delete does not exist', async () => {
      const result = await repository.delete('non-existent-id');

      expect(result).toBeUndefined();
    });
  });

  describe('default collection', () => {
    it('should use collection from getMongoDb when no collection is provided', async () => {
      const defaultRepo = new MongoDbProxyRepository();
      const result = await defaultRepo.findAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
