import { faker } from '@faker-js/faker';
import {
  describe, it, expect, vi, beforeEach, type Mock,
} from 'vitest';

import { CreateProxyUseCase, type CreateProxyDTO } from '@/application/use-cases/proxies/create-proxy.use-case.js';
import { ProxyEntity } from '@/domain/entities/proxy.entity.js';
import type { ProxyEventBus } from '@/domain/events/proxy.events.js';
import type { ProxyRepository } from '@/domain/repositories/proxy.repository.js';

describe('CreateProxyUseCase', () => {
  let useCase: CreateProxyUseCase;
  let mockProxyRepository: { [K in keyof ProxyRepository]: Mock };
  let mockProxyEventBus: { [K in keyof ProxyEventBus]: Mock };

  beforeEach(() => {
    mockProxyRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByNamespace: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockProxyEventBus = {
      emitNewProxy: vi.fn(),
      emitUpdatedProxy: vi.fn(),
      emitDeletedProxy: vi.fn(),
    };

    useCase = new CreateProxyUseCase(
      mockProxyRepository as unknown as ProxyRepository,
      mockProxyEventBus as unknown as ProxyEventBus,
    );
  });

  it('should create a proxy, save it in repository, emit event, and return the proxy', async () => {
    const dto: CreateProxyDTO = {
      namespace: faker.internet.domainWord(),
      target: faker.internet.url(),
    };

    const createdProxy = new ProxyEntity({
      id: faker.datatype.uuid(),
      namespace: dto.namespace,
      target: dto.target,
    });

    mockProxyRepository.create.mockResolvedValue(createdProxy);

    const result = await useCase.execute(dto);

    expect(mockProxyRepository.create).toHaveBeenCalledTimes(1);
    const passedEntity = mockProxyRepository.create.mock.calls[0][0];
    expect(passedEntity).toBeInstanceOf(ProxyEntity);
    expect(passedEntity.namespace).toBe(dto.namespace);
    expect(passedEntity.target).toBe(dto.target);
    expect(mockProxyEventBus.emitNewProxy).toHaveBeenCalledWith(createdProxy);
    expect(result).toBe(createdProxy);
  });

  it('should propagate repository errors and not emit event', async () => {
    const dto: CreateProxyDTO = {
      namespace: faker.internet.domainWord(),
      target: faker.internet.url(),
    };

    const error = new Error('Database error');
    mockProxyRepository.create.mockRejectedValue(error);

    await expect(useCase.execute(dto)).rejects.toThrow('Database error');
    expect(mockProxyEventBus.emitNewProxy).not.toHaveBeenCalled();
  });
});
