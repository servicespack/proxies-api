import type { ProxyRepository } from '../../../domain/repositories/proxy.repository.js';

export class ResolveProxyTargetUseCase {
  constructor(private readonly proxyRepository: ProxyRepository) {}

  async execute(namespace: string): Promise<string | undefined> {
    const proxy = await this.proxyRepository.findByNamespace(namespace);

    return proxy?.target;
  }
}
