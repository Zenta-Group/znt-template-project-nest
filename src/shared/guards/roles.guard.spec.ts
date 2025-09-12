import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new RolesGuard(reflector);
  });

  it('should allow if no roles required', () => {
    (reflector.getAllAndOverride as any).mockReturnValue(undefined);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({ getRequest: () => ({}) }),
    } as any;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw if user not found', () => {
    (reflector.getAllAndOverride as any).mockReturnValue(['ADMIN']);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({ getRequest: () => ({}) }),
    } as any;
    expect(() => guard.canActivate(context)).toThrow();
  });

  it('should throw if role not allowed', () => {
    (reflector.getAllAndOverride as any).mockReturnValue(['ADMIN']);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest
        .fn()
        .mockReturnValue({ getRequest: () => ({ user: { role: 'USER' } }) }),
    } as any;
    expect(() => guard.canActivate(context)).toThrow();
  });

  it('should allow if role allowed', () => {
    (reflector.getAllAndOverride as any).mockReturnValue(['ADMIN']);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest
        .fn()
        .mockReturnValue({ getRequest: () => ({ user: { role: 'ADMIN' } }) }),
    } as any;
    expect(guard.canActivate(context)).toBe(true);
  });
});
