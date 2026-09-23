import type { ProxyEntity } from '@/domain/entities/proxy.entity.js';
import type { ProxyEventBus } from '@/domain/events/proxy.events.js';
import type { ProxyRepository } from '@/domain/repositories/proxy.repository.js';

export interface UpdateProxyDTO {
  readonly namespace?: string;
  readonly target?: string;
}

export class UpdateProxyUseCase {
  constructor(
    private readonly proxyRepository: ProxyRepository,
    private readonly proxyEventBus: ProxyEventBus,
  ) {}

  async execute(id: string, dto: UpdateProxyDTO): Promise<ProxyEntity | undefined> {
    const updatedProxy = await this.proxyRepository.update(id, dto);

    if (updatedProxy) {
      this.proxyEventBus.emitUpdatedProxy(updatedProxy);
    }

    return updatedProxy;
  }
}
