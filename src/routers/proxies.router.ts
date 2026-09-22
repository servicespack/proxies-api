import { Router } from 'express';

import { ProxiesController } from '../adapters/controllers/proxies.controller.js';
import { NodeProxyEventBus } from '../adapters/events/node-proxy.eventbus.js';
import { LowDbProxyRepository } from '../adapters/repositories/lowdb-proxy.repository.js';
import { ProxyEventBus } from '../domain/events/proxy.events.js';
import { ProxyRepository } from '../domain/repositories/proxy.repository.js';
import { CreateProxyUseCase } from '../usecases/create-proxy.usecase.js';
import { DeleteProxyUseCase } from '../usecases/delete-proxy.usecase.js';
import { GetProxyUseCase } from '../usecases/get-proxy.usecase.js';
import { ListProxiesUseCase } from '../usecases/list-proxies.usecase.js';
import { UpdateProxyUseCase } from '../usecases/update-proxy.usecase.js';
import { ProxiesValidator } from '../validators/proxies.validator.js';

const { ENABLE_PROXIES_CRUD = 'true' } = process.env;

export const createProxiesRouter = (
  repository: ProxyRepository,
  eventBus: ProxyEventBus = new NodeProxyEventBus(),
): Router => {
  const router = Router();

  const listProxiesUseCase = new ListProxiesUseCase(repository);
  const createProxyUseCase = new CreateProxyUseCase(repository, eventBus);
  const getProxyUseCase = new GetProxyUseCase(repository);
  const updateProxyUseCase = new UpdateProxyUseCase(repository, eventBus);
  const deleteProxyUseCase = new DeleteProxyUseCase(repository, eventBus);

  const proxiesController = new ProxiesController(
    listProxiesUseCase,
    createProxyUseCase,
    getProxyUseCase,
    updateProxyUseCase,
    deleteProxyUseCase,
  );

  if (ENABLE_PROXIES_CRUD === 'true') {
    router
      .get('/', proxiesController.list)
      .post('/', ProxiesValidator.create, proxiesController.create)
      .get('/:proxyId', proxiesController.get)
      .patch('/:proxyId', ProxiesValidator.update, proxiesController.update)
      .delete('/:proxyId', proxiesController.delete);
  }

  return router;
};

export const proxyRepository = new LowDbProxyRepository();
export const proxies = createProxiesRouter(proxyRepository);
