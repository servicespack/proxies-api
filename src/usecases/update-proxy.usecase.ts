import { ProxyEntity } from '../domain/entities/proxy.entity.js';
import { ProxyEventBus } from '../domain/events/proxy.events.js';
import { ProxyRepository } from '../domain/repositories/proxy.repository.js';

export interface UpdateProxyDTO {
  readonly namespace?: string;
  readonly target?: string;
}

export class UpdateProxyUseCase {
  proxyRepository: ProxyRepository;

  proxyEventBus: ProxyEventBus;

  constructor(
    proxyRepository: ProxyRepository,
    proxyEventBus: ProxyEventBus,
  ) {
    this.proxyRepository = proxyRepository;
    this.proxyEventBus = proxyEventBus;
  }

  async execute(id: string, dto: UpdateProxyDTO): Promise<ProxyEntity | undefined> {
    const updatedProxy = await this.proxyRepository.update(id, dto);

    if (updatedProxy) {
      this.proxyEventBus.emitUpdatedProxy(updatedProxy);
    }

    return updatedProxy;
  }
}
