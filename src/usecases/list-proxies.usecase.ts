import { ProxyEntity } from '../domain/entities/proxy.entity.js';
import { ProxyRepository } from '../domain/repositories/proxy.repository.js';

export class ListProxiesUseCase {
  proxyRepository: ProxyRepository;

  constructor(proxyRepository: ProxyRepository) {
    this.proxyRepository = proxyRepository;
  }

  async execute(): Promise<ProxyEntity[]> {
    return this.proxyRepository.findAll();
  }
}
