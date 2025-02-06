// auth-exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

export class InvalidTokenException extends AuthException {
  constructor(details?: string) {
    super(`Token inválido: ${details || ''}`, HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends AuthException {
  constructor(email: string) {
    super(
      `No se encontró el usuario con email: ${email}`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class GenericAuthException extends AuthException {
  constructor(details?: string) {
    super(
      `Error de autenticación: ${details || ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('Usuario o contraseña inválida', HttpStatus.UNAUTHORIZED);
  }
}
