import { ProxyEntity } from '../../../domain/entities/proxy.entity.js';
import { ProxyEventBus } from '../../../domain/events/proxy.events.js';
import { ProxyRepository } from '../../../domain/repositories/proxy.repository.js';

export class DeleteProxyUseCase {
  proxyRepository: ProxyRepository;

  proxyEventBus: ProxyEventBus;

  constructor(
    proxyRepository: ProxyRepository,
    proxyEventBus: ProxyEventBus,
  ) {
    this.proxyRepository = proxyRepository;
    this.proxyEventBus = proxyEventBus;
  }

  async execute(id: string): Promise<ProxyEntity | undefined> {
    const deletedProxy = await this.proxyRepository.delete(id);

    if (deletedProxy) {
      this.proxyEventBus.emitDeletedProxy(deletedProxy);
    }

    return deletedProxy;
  }
}
