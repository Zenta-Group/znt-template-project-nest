import { HttpException, HttpStatus } from '@nestjs/common';

export class IntegrationException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

export class InvalidEndpointException extends IntegrationException {
  constructor(endpoint: string) {
    super(`El endpoint '${endpoint}' no es válido.`, HttpStatus.BAD_REQUEST);
  }
}

export class ResourceNotFoundException extends IntegrationException {
  constructor(endpoint: string) {
    super(
      `No se encontró el recurso en el endpoint '${endpoint}'.`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnauthorizedAccessException extends IntegrationException {
  constructor() {
    super('Acceso no autorizado al servicio externo.', HttpStatus.UNAUTHORIZED);
  }
}

export class BadRequestException extends IntegrationException {
  constructor(details?: string) {
    super(`Solicitud incorrecta. ${details ?? ''}`, HttpStatus.BAD_REQUEST);
  }
}

export class InternalServerErrorException extends IntegrationException {
  constructor(details?: string) {
    super(
      `Error interno del servidor externo. ${details ?? ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
