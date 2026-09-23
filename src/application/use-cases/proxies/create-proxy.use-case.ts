import { ProxyEntity } from '../../../domain/entities/proxy.entity.js';
import type { ProxyEventBus } from '../../../domain/events/proxy.events.js';
import type { ProxyRepository } from '../../../domain/repositories/proxy.repository.js';

export interface CreateProxyDTO {
  readonly namespace: string;
  readonly target: string;
}

export class CreateProxyUseCase {
  constructor(
    private readonly proxyRepository: ProxyRepository,
    private readonly proxyEventBus: ProxyEventBus,
  ) {}

  async execute(dto: CreateProxyDTO): Promise<ProxyEntity> {
    const proxy = new ProxyEntity({ namespace: dto.namespace, target: dto.target });
    const createdProxy = await this.proxyRepository.create(proxy);
    this.proxyEventBus.emitNewProxy(createdProxy);
    return createdProxy;
  }
}
