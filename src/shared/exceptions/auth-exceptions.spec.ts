import {
  AuthException,
  InvalidTokenException,
  UserNotFoundException,
  GenericAuthException,
  InvalidCredentialsException,
} from './auth-exceptions';
import { HttpStatus } from '@nestjs/common';

describe('AuthException', () => {
  it('debería crear AuthException con mensaje y status', () => {
    const ex = new AuthException('msg', HttpStatus.BAD_REQUEST);
    expect(ex.message).toBe('msg');
    expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe('InvalidTokenException', () => {
  it('debería crear con detalles', () => {
    const ex = new InvalidTokenException('error');
    expect(ex.message).toContain('Token inválido: error');
    expect(ex.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
  it('debería crear sin detalles', () => {
    const ex = new InvalidTokenException();
    expect(ex.message).toContain('Token inválido:');
    expect(ex.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe('UserNotFoundException', () => {
  it('debería crear con email', () => {
    const ex = new UserNotFoundException('test@mail.com');
    expect(ex.message).toContain('test@mail.com');
    expect(ex.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});

describe('GenericAuthException', () => {
  it('debería crear con detalles', () => {
    const ex = new GenericAuthException('fail');
    expect(ex.message).toContain('Error de autenticación: fail');
    expect(ex.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
  it('debería crear sin detalles', () => {
    const ex = new GenericAuthException();
    expect(ex.message).toContain('Error de autenticación:');
    expect(ex.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('InvalidCredentialsException', () => {
  it('debería crear correctamente', () => {
    const ex = new InvalidCredentialsException();
    expect(ex.message).toBe('Usuario o contraseña inválida');
    expect(ex.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
});
