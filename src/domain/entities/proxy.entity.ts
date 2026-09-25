import { randomUUID } from 'node:crypto';

export interface ProxyEntityProps {
  readonly id?: string;
  readonly namespace: string;
  readonly target: string;
  readonly createdAt?: string;
}

export class ProxyEntity {
  public readonly id: string;

  public readonly namespace: string;

  public readonly target: string;

  public readonly createdAt: string;

  constructor({
    id = randomUUID(),
    namespace,
    target,
    createdAt = new Date().toISOString(),
  }: ProxyEntityProps) {
    this.id = id;
    this.namespace = namespace;
    this.target = target;
    this.createdAt = createdAt;
  }
}
