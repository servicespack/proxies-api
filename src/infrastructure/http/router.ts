import { Router } from 'express';

import { ProxiesController } from '../../adapters/controllers/proxies.controller.js';
import { NodeProxyEventBus } from '../../adapters/events/node-proxy.eventbus.js';
import { auth } from '../../adapters/middlewares/auth.middleware.js';
import { ProxiesValidator } from '../../adapters/validators/proxies.validator.js';
import { CreateProxyUseCase } from '../../application/use-cases/proxies/create-proxy.use-case.js';
import { DeleteProxyUseCase } from '../../application/use-cases/proxies/delete-proxy.use-case.js';
import { GetProxyUseCase } from '../../application/use-cases/proxies/get-proxy.use-case.js';
import { ListProxiesUseCase } from '../../application/use-cases/proxies/list-proxies.use-case.js';
import { ResolveProxyTargetUseCase } from '../../application/use-cases/proxies/resolve-proxy-target.use-case.js';
import { UpdateProxyUseCase } from '../../application/use-cases/proxies/update-proxy.use-case.js';
import { LowDbProxyRepository } from '../database/lowdb/repositories/lowdb-proxy.repository.js';

import { docs } from './routers/docs.router.js';
import { metrics } from './routers/metrics.router.js';

const { ENABLE_PROXIES_CRUD = 'true', TOKEN } = process.env;

// Infrastructure Adapters
export const proxyRepository = new LowDbProxyRepository();
export const proxyEventBus = new NodeProxyEventBus();

// Application Use Cases
export const listProxiesUseCase = new ListProxiesUseCase(proxyRepository);
export const createProxyUseCase = new CreateProxyUseCase(proxyRepository, proxyEventBus);
export const getProxyUseCase = new GetProxyUseCase(proxyRepository);
export const updateProxyUseCase = new UpdateProxyUseCase(proxyRepository, proxyEventBus);
export const deleteProxyUseCase = new DeleteProxyUseCase(proxyRepository, proxyEventBus);
export const resolveProxyTargetUseCase = new ResolveProxyTargetUseCase(proxyRepository);

// Controller
export const proxiesController = new ProxiesController(
  listProxiesUseCase,
  createProxyUseCase,
  getProxyUseCase,
  updateProxyUseCase,
  deleteProxyUseCase,
);

const proxiesRouter = Router();

if (ENABLE_PROXIES_CRUD === 'true') {
  proxiesRouter
    .get('/', proxiesController.list)
    .post('/', ProxiesValidator.create, proxiesController.create)
    .get('/:proxyId', proxiesController.get)
    .patch('/:proxyId', ProxiesValidator.update, proxiesController.update)
    .delete('/:proxyId', proxiesController.delete);
}

export const router = Router();
router.use('/docs', docs);
router.use('/metrics', metrics);
router.use('/proxies', auth({ token: TOKEN }), proxiesRouter);

export default router;
