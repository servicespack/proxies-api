import { Router } from 'express';

import { docs } from './routers/docs.router.js';
import { metrics } from './routers/metrics.router.js';

import { ProxiesController } from '@/adapters/controllers/proxies.controller.js';
import { NodeProxyEventBus } from '@/adapters/events/node-proxy.eventbus.js';
import { auth } from '@/adapters/middlewares/auth.middleware.js';
import { proxiesValidator } from '@/adapters/validators/proxies.validator.js';
import { CreateProxyUseCase } from '@/application/use-cases/proxies/create-proxy.use-case.js';
import { DeleteProxyUseCase } from '@/application/use-cases/proxies/delete-proxy.use-case.js';
import { GetProxyUseCase } from '@/application/use-cases/proxies/get-proxy.use-case.js';
import { ListProxiesUseCase } from '@/application/use-cases/proxies/list-proxies.use-case.js';
import { ResolveProxyTargetUseCase } from '@/application/use-cases/proxies/resolve-proxy-target.use-case.js';
import { UpdateProxyUseCase } from '@/application/use-cases/proxies/update-proxy.use-case.js';
import { LowDbProxyRepository } from '@/infrastructure/database/lowdb/repositories/lowdb-proxy.repository.js';
import { ProxiesEmitter } from '@/infrastructure/events/proxies.emitter.js';

const { ENABLE_PROXIES_CRUD = 'true', TOKEN } = process.env;

const proxyRepository = new LowDbProxyRepository();
const proxyEventBus = new NodeProxyEventBus(ProxiesEmitter.emitter);

const proxiesController = new ProxiesController({
  listProxiesUseCase: new ListProxiesUseCase(proxyRepository),
  createProxyUseCase: new CreateProxyUseCase(proxyRepository, proxyEventBus),
  getProxyUseCase: new GetProxyUseCase(proxyRepository),
  updateProxyUseCase: new UpdateProxyUseCase(proxyRepository, proxyEventBus),
  deleteProxyUseCase: new DeleteProxyUseCase(proxyRepository, proxyEventBus),
});

export const resolveProxyTargetUseCase = new ResolveProxyTargetUseCase(proxyRepository);

const proxiesRouter = Router();

if (ENABLE_PROXIES_CRUD === 'true') {
  if (!TOKEN) {
    throw new Error('TOKEN environment variable is required to enable proxies CRUD routes.');
  }

  proxiesRouter
    .get('/', proxiesController.list)
    .post('/', proxiesValidator.create, proxiesController.create)
    .get('/:proxyId', proxiesController.get)
    .patch('/:proxyId', proxiesValidator.update, proxiesController.update)
    .delete('/:proxyId', proxiesController.delete);
}

export const router = Router();
router.use('/docs', docs);
router.use('/metrics', metrics);
router.use('/proxies', auth({ token: () => process.env.TOKEN }), proxiesRouter);
