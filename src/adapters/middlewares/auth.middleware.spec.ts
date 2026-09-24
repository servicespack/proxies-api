import type { Request, Response, NextFunction } from 'express';
import {
  describe, it, expect, vi,
} from 'vitest';

import { auth } from '@/adapters/middlewares/auth.middleware.js';

describe('auth middleware', () => {
  const createMockResponse = () => {
    const response = {} as Response;
    response.status = vi.fn().mockReturnValue(response) as any;
    response.json = vi.fn().mockReturnValue(response) as any;
    return response;
  };

  const createMockRequest = (overrides = {}) => ({
    headers: {},
    query: {},
    ...overrides,
  } as Request);

  describe('when validToken is provided as a string', () => {
    it('should call next when token matches Bearer authorization header', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        headers: { authorization: 'Bearer secret-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    });

    it('should call next when token matches case-insensitive bearer header', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        headers: { authorization: 'bearer secret-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    });

    it('should call next when token matches authorization header without Bearer prefix', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        headers: { authorization: 'secret-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    });

    it('should call next when token matches query param', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        query: { token: 'secret-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    });

    it('should prioritize authorization header over query token', () => {
      const middleware = auth({ token: 'header-token' });
      const request = createMockRequest({
        headers: { authorization: 'Bearer header-token' },
        query: { token: 'query-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is invalid', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        headers: { authorization: 'Bearer wrong-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 when query token is invalid', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest({
        query: { token: 'wrong-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 when no token is provided in request', () => {
      const middleware = auth({ token: 'secret-token' });
      const request = createMockRequest();
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('when validToken is provided as a function', () => {
    it('should call next when token function returns matching token', () => {
      const tokenFn = vi.fn().mockReturnValue('dynamic-token');
      const middleware = auth({ token: tokenFn });
      const request = createMockRequest({
        headers: { authorization: 'Bearer dynamic-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(tokenFn).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    });

    it('should return 401 when token function returns non-matching token', () => {
      const tokenFn = vi.fn().mockReturnValue('expected-token');
      const middleware = auth({ token: tokenFn });
      const request = createMockRequest({
        headers: { authorization: 'Bearer wrong-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(tokenFn).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 when token function returns undefined', () => {
      const tokenFn = vi.fn().mockReturnValue(undefined);
      const middleware = auth({ token: tokenFn });
      const request = createMockRequest({
        headers: { authorization: 'Bearer any-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(tokenFn).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });

  describe('when validToken is undefined', () => {
    it('should return 401 when params token is undefined', () => {
      const middleware = auth({});
      const request = createMockRequest({
        headers: { authorization: 'Bearer any-token' },
      });
      const response = createMockResponse();
      const next = vi.fn();

      middleware(request, response, next);

      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});
