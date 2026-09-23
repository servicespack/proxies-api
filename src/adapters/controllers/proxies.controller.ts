import type { NextFunction, Request, Response } from 'express';

import type { CreateProxyUseCase } from '../../application/use-cases/proxies/create-proxy.use-case.js';
import type { DeleteProxyUseCase } from '../../application/use-cases/proxies/delete-proxy.use-case.js';
import type { GetProxyUseCase } from '../../application/use-cases/proxies/get-proxy.use-case.js';
import type { ListProxiesUseCase } from '../../application/use-cases/proxies/list-proxies.use-case.js';
import type { UpdateProxyUseCase } from '../../application/use-cases/proxies/update-proxy.use-case.js';

export interface ProxiesControllerDependencies {
  readonly listProxiesUseCase: ListProxiesUseCase;
  readonly createProxyUseCase: CreateProxyUseCase;
  readonly getProxyUseCase: GetProxyUseCase;
  readonly updateProxyUseCase: UpdateProxyUseCase;
  readonly deleteProxyUseCase: DeleteProxyUseCase;
}

export class ProxiesController {
  private readonly listProxiesUseCase: ListProxiesUseCase;

  private readonly createProxyUseCase: CreateProxyUseCase;

  private readonly getProxyUseCase: GetProxyUseCase;

  private readonly updateProxyUseCase: UpdateProxyUseCase;

  private readonly deleteProxyUseCase: DeleteProxyUseCase;

  constructor(dependencies: ProxiesControllerDependencies) {
    this.listProxiesUseCase = dependencies.listProxiesUseCase;
    this.createProxyUseCase = dependencies.createProxyUseCase;
    this.getProxyUseCase = dependencies.getProxyUseCase;
    this.updateProxyUseCase = dependencies.updateProxyUseCase;
    this.deleteProxyUseCase = dependencies.deleteProxyUseCase;
  }

  private notFound(response: Response): Response {
    return response.status(404).json({ error: 'Not found' });
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
        return this.notFound(response);
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
        return this.notFound(response);
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
        return this.notFound(response);
      }

      return response.json(proxy);
    } catch (error) {
      return next(error);
    }
  };
}
