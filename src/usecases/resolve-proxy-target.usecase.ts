import { ProxyRepository } from '../domain/repositories/proxy.repository.js';

export class ResolveProxyTargetUseCase {
  proxyRepository: ProxyRepository;

  constructor(proxyRepository: ProxyRepository) {
    this.proxyRepository = proxyRepository;
  }

  async execute(namespace: string): Promise<string | undefined> {
    const proxy = await this.proxyRepository.findByNamespace(namespace);

    return proxy?.target;
  }
}
