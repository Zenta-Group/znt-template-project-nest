import { CsrfInterceptor } from './csrf.interceptor';
import {
  CallHandler,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

describe('CsrfInterceptor', () => {
  let interceptor: CsrfInterceptor;
  let csrfService: { validateCsrfToken: jest.Mock };
  let context: Partial<ExecutionContext>;
  let next: Partial<CallHandler>;

  beforeEach(() => {
    csrfService = { validateCsrfToken: jest.fn() };
    interceptor = new CsrfInterceptor(csrfService as any);
    next = { handle: jest.fn().mockReturnValue('handled') };
  });

  function getContextMock(user: any, headers: any) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user, headers }),
      }),
    } as any;
  }

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('permite el paso si el usuario y el token CSRF son válidos', async () => {
    const user = { id: 'user1' };
    const headers = { 'x-csrf-token': 'token123' };
    csrfService.validateCsrfToken.mockResolvedValue(true);
    const ctx = getContextMock(user, headers);
    const result = await interceptor.intercept(ctx, next as any);
    expect(csrfService.validateCsrfToken).toHaveBeenCalledWith(
      'user1',
      'token123',
    );
    expect(result).toBe('handled');
  });

  it('lanza error si el usuario no está autenticado', async () => {
    const ctx = getContextMock(undefined, { 'x-csrf-token': 'token123' });
    await expect(interceptor.intercept(ctx, next as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('lanza error si falta el token CSRF', async () => {
    const user = { id: 'user1' };
    const ctx = getContextMock(user, {});
    await expect(interceptor.intercept(ctx, next as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('lanza error si el token CSRF es inválido', async () => {
    const user = { id: 'user1' };
    const headers = { 'x-csrf-token': 'token123' };
    csrfService.validateCsrfToken.mockResolvedValue(false);
    const ctx = getContextMock(user, headers);
    await expect(interceptor.intercept(ctx, next as any)).rejects.toThrow(
      BadRequestException,
    );
  });
});
