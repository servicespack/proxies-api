import http from 'node:http';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import helmet from 'helmet';
import pino from 'pino-http';

import { resolveProxyTargetUseCase, router } from './router.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(pino({
  ...process.env.NODE_ENV !== 'production'
    ? {
      transport: {
        target: 'pino-pretty',
      },
    }
    : {},
}));

app.get('/', (_request: Request, response: Response) => response.json({ I: 'am alive' }));
app.use(router);
app.use('/:namespace', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const target = await resolveProxyTargetUseCase.execute(String(request.params.namespace));
    if (!target) {
      return response.status(404).json({ error: 'Namespace not found' });
    }
    return proxy(target)(request, response, next);
  } catch (error) {
    return next(error);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
  const status = error.status || error.statusCode || 500;
  return response.status(status).json({
    error: error.message || 'Internal Server Error',
  });
});

export const server = http.createServer(app);
export { app };
