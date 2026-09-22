import { NextFunction, Request, Response } from 'express';

import { CreateProxyUseCase } from '../../usecases/create-proxy.usecase.js';
import { DeleteProxyUseCase } from '../../usecases/delete-proxy.usecase.js';
import { GetProxyUseCase } from '../../usecases/get-proxy.usecase.js';
import { ListProxiesUseCase } from '../../usecases/list-proxies.usecase.js';
import { UpdateProxyUseCase } from '../../usecases/update-proxy.usecase.js';

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
