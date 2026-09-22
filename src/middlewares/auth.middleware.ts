import { NextFunction, Request, Response } from 'express';

export interface AuthParams {
  token?: string;
}

export function auth(params: AuthParams) {
  return function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const { token } = request.query;
    if (token !== params.token) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }

    return next();
  };
}
