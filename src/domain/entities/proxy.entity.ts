import { randomUUID } from 'node:crypto';

export class ProxyEntity {
  id: string;

  namespace: string;

  target: string;

  createdAt: string;

  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.namespace
   * @param {string} params.target
   * @param {Date} [params.createdAt]
   */
  constructor({
    id = randomUUID(),
    namespace,
    target,
    createdAt = new Date().toISOString(),
  }: {
    id?: string,
    namespace: string,
    target: string,
    createdAt?: string,
  }) {
    this.id = id;
    this.namespace = namespace;
    this.target = target;
    this.createdAt = createdAt;
  }
}
