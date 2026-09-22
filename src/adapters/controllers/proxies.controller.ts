import { NextFunction, Request, Response } from 'express';

import { CreateProxyUseCase } from '../../application/use-cases/proxies/create-proxy.use-case.js';
import { DeleteProxyUseCase } from '../../application/use-cases/proxies/delete-proxy.use-case.js';
import { GetProxyUseCase } from '../../application/use-cases/proxies/get-proxy.use-case.js';
import { ListProxiesUseCase } from '../../application/use-cases/proxies/list-proxies.use-case.js';
import { UpdateProxyUseCase } from '../../application/use-cases/proxies/update-proxy.use-case.js';

export class ProxiesController {
  listProxiesUseCase: ListProxiesUseCase;

  createProxyUseCase: CreateProxyUseCase;

  getProxyUseCase: GetProxyUseCase;

  updateProxyUseCase: UpdateProxyUseCase;

  deleteProxyUseCase: DeleteProxyUseCase;

  constructor(
    listProxiesUseCase: ListProxiesUseCase,
    createProxyUseCase: CreateProxyUseCase,
    getProxyUseCase: GetProxyUseCase,
    updateProxyUseCase: UpdateProxyUseCase,
    deleteProxyUseCase: DeleteProxyUseCase,
  ) {
    this.listProxiesUseCase = listProxiesUseCase;
    this.createProxyUseCase = createProxyUseCase;
    this.getProxyUseCase = getProxyUseCase;
    this.updateProxyUseCase = updateProxyUseCase;
    this.deleteProxyUseCase = deleteProxyUseCase;
  }

  list = async (
    _request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const proxies = await this.listProxiesUseCase.execute();
      return response.json({ data: proxies });
    } catch (error) {
      return next(error);
    }
  };

  create = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { namespace, target } = request.body;
      const proxy = await this.createProxyUseCase.execute({ namespace, target });
      return response.status(201).json(proxy);
    } catch (error) {
      return next(error);
    }
  };

  get = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const proxyId = String(request.params.proxyId);
      const proxy = await this.getProxyUseCase.execute(proxyId);

      if (!proxy) {
        return response.status(404).json({ error: 'Not found' });
      }

      return response.json(proxy);
    } catch (error) {
      return next(error);
    }
  };

  update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const proxyId = String(request.params.proxyId);
      const proxy = await this.updateProxyUseCase.execute(proxyId, request.body);

      if (!proxy) {
        return response.status(404).json({ error: 'Not found' });
      }

      return response.json(proxy);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const proxyId = String(request.params.proxyId);
      const proxy = await this.deleteProxyUseCase.execute(proxyId);

      if (!proxy) {
        return response.status(404).json({ error: 'Not found' });
      }

      return response.json(proxy);
    } catch (error) {
      return next(error);
    }
  };
}
