import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

export class MissingCollectionException extends DatabaseException {
  constructor() {
    super(
      'No se definió el nombre de la colección/tabla.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DocumentNotFoundException extends DatabaseException {
  constructor(id: string) {
    super(`No se encontró el documento con ID: ${id}`, HttpStatus.NOT_FOUND);
  }
}

export class DocumentConflictException extends DatabaseException {
  constructor(id: string) {
    super(`Ya existe un documento con el ID: ${id}`, HttpStatus.CONFLICT);
  }
}

export class DatabaseAccessDeniedException extends DatabaseException {
  constructor(message?: string) {
    super(
      message || 'Acceso denegado a la base de datos.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class QueryFailedException extends DatabaseException {
  constructor(details?: string) {
    super(
      `Falló la ejecución de la consulta. ${details ?? ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class GenericDatabaseException extends DatabaseException {
  constructor(details?: string) {
    super(
      `Error general de base de datos: ${details ?? ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
