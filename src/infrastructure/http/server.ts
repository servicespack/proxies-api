import http from 'node:http';

import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import proxy from 'express-http-proxy';
import helmet from 'helmet';
import pino from 'pino-http';

import { resolveProxyTargetUseCase, router } from './router.js';

import { logger } from '@/config/logger.js';

export function sanitizeLogRequest(req: Record<string, unknown>): Record<string, unknown> {
  const serialized = { ...req };
  if (typeof serialized.url === 'string') {
    serialized.url = serialized.url.replace(/([?&])token=[^&]+/, '$1token=***');
  }
  if (serialized.query && typeof serialized.query === 'object') {
    const { token: _token, ...restQuery } = serialized.query as Record<string, unknown>;
    serialized.query = restQuery;
  }
  return serialized;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(pino({
  logger,
  redact: ['req.headers.authorization', 'req.query.token'],
  serializers: {
    req: sanitizeLogRequest,
  },
}));

app.get('/', (_request: Request, response: Response) => response.json({ I: 'am alive' }));
app.use(router);

const dynamicProxyRouter = express.Router();
dynamicProxyRouter.use('/:namespace', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const target = await resolveProxyTargetUseCase.execute(String(request.params.namespace));
    if (!target) {
      response.status(404).json({ error: 'Namespace not found' });
      return;
    }
    proxy(target)(request, response, next);
  } catch (error) {
    next(error);
  }
});
app.use(dynamicProxyRouter);

export interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

app.use((error: HttpError, _request: Request, response: Response, _next: NextFunction): void => {
  const status = error.status || error.statusCode || 500;
  response.status(status).json({
    error: error.message || 'Internal Server Error',
  });
});

export const server = http.createServer(app);
export { app };
