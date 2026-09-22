import { ProxyEntity } from '../domain/entities/proxy.entity.js';
import { ProxyEventBus } from '../domain/events/proxy.events.js';
import { ProxyRepository } from '../domain/repositories/proxy.repository.js';

export interface CreateProxyDTO {
  readonly namespace: string;
  readonly target: string;
}

export class CreateProxyUseCase {
  proxyRepository: ProxyRepository;

  proxyEventBus: ProxyEventBus;

  constructor(
    proxyRepository: ProxyRepository,
    proxyEventBus: ProxyEventBus,
  ) {
    this.proxyRepository = proxyRepository;
    this.proxyEventBus = proxyEventBus;
  }

  async execute(dto: CreateProxyDTO): Promise<ProxyEntity> {
    const proxy = new ProxyEntity({ namespace: dto.namespace, target: dto.target });
    const createdProxy = await this.proxyRepository.create(proxy);
    this.proxyEventBus.emitNewProxy(createdProxy);
    return createdProxy;
  }
}
