import { db } from '../../db.js';
import { ProxyEntity } from '../../domain/entities/proxy.entity.js';
import { ProxyRepository } from '../../domain/repositories/proxy.repository.js';

export class LowDbProxyRepository implements ProxyRepository {
  private database;

  constructor(database = db) {
    this.database = database;
  }

  async findAll(): Promise<ProxyEntity[]> {
    await this.database.read();
    return this.database.data?.proxies ?? [];
  }

  async findById(id: string): Promise<ProxyEntity | undefined> {
    await this.database.read();
    return this.database.data?.proxies.find((proxy) => proxy.id === id);
  }

  async findByNamespace(namespace: string): Promise<ProxyEntity | undefined> {
    await this.database.read();
    return this.database.data?.proxies.find((proxy) => proxy.namespace === namespace);
  }

  async create(proxy: ProxyEntity): Promise<ProxyEntity> {
    await this.database.read();
    this.database.data ||= { proxies: [] };
    this.database.data.proxies.push(proxy);
    await this.database.write();
    return proxy;
  }

  async update(id: string, proxyData: Partial<ProxyEntity>): Promise<ProxyEntity | undefined> {
    await this.database.read();
    const proxyIndex = this.database.data?.proxies.findIndex((proxy) => proxy.id === id) ?? -1;
    const NOT_FOUND_INDEX = -1;

    if (proxyIndex === NOT_FOUND_INDEX) {
      return undefined;
    }

    const updatedProxy = {
      ...this.database.data.proxies[proxyIndex],
      ...proxyData,
      id,
    };

    this.database.data.proxies[proxyIndex] = updatedProxy;
    await this.database.write();

    return updatedProxy;
  }

  async delete(id: string): Promise<ProxyEntity | undefined> {
    await this.database.read();
    const proxy = this.database.data?.proxies.find((p) => p.id === id);

    if (!proxy) {
      return undefined;
    }

    this.database.data.proxies = this.database.data.proxies.filter((p) => p.id !== id);
    await this.database.write();

    return proxy;
  }
}
