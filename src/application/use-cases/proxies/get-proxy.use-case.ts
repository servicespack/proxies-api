import { ProxyEntity } from '../../../domain/entities/proxy.entity.js';
import { ProxyRepository } from '../../../domain/repositories/proxy.repository.js';

export class GetProxyUseCase {
  proxyRepository: ProxyRepository;

  constructor(proxyRepository: ProxyRepository) {
    this.proxyRepository = proxyRepository;
  }

  async execute(id: string): Promise<ProxyEntity | undefined> {
    return this.proxyRepository.findById(id);
  }
}
