import { randomUUID } from 'node:crypto'

export class ProxyEntity {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.namespace
   * @param {string} params.target
   * @param {Date} [params.createdAt]
   */
  constructor ({
    id = randomUUID(),
    namespace,
    target,
    createdAt = new Date().toISOString()
  }) {
    this.id = id
    this.namespace = namespace
    this.target = target
    this.createdAt = createdAt
  }
}
