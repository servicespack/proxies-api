/* eslint-disable no-unused-vars */
import { ProxyEntity } from '../entities/proxy.entity.js';

export interface ProxyRepository {
  findAll(): Promise<ProxyEntity[]>;
  findById(id: string): Promise<ProxyEntity | undefined>;
  findByNamespace(namespace: string): Promise<ProxyEntity | undefined>;
  create(proxy: ProxyEntity): Promise<ProxyEntity>;
  update(id: string, proxy: Partial<ProxyEntity>): Promise<ProxyEntity | undefined>;
  delete(id: string): Promise<ProxyEntity | undefined>;
}
