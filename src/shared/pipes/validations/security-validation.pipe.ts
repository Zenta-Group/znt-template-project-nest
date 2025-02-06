import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class SecurityValidationPipe implements PipeTransform {
  // Patrones maliciosos para SQL Injection
  private readonly sqlInjectionPatterns = [
    /;/, // Separador de comandos
    /--/, // Comentarios SQL
    /\/\*/, // Comentarios multilínea SQL
    /UNION\s+SELECT/i, // UNION SELECT en SQL
    /DROP\s+(TABLE|DATABASE)/i, // DROP TABLE/DATABASE en SQL
    /EXEC\s+/i, // Ejecución de comandos
    /db\.collection/i, // Acceso a colecciones en Firestore
    /db\.doc/i, // Acceso a documentos en Firestore
    /attribute_exists/i, // Condición en DynamoDB
    /EVAL\s+/i, // Scripts Lua en Redis
    /FLUSHALL/i, // Borrado masivo en Redis
    /DROP\s+DATABASE/i, // DROP DATABASE en CosmosDB
  ];

  // Patrones maliciosos para XSS
  private readonly xssPatterns = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi, // Etiquetas <script>
    /javascript:/i, // Protocolo JavaScript
    /onerror\s*=/i, // Eventos maliciosos
    /onload\s*=/i, // Eventos maliciosos
    /<iframe\b[^>]*>/gi, // Etiquetas <iframe>
  ];

  transform(value: any, metadata: ArgumentMetadata): any {
    // Si el valor es un objeto, validamos recursivamente
    if (typeof value === 'object' && value !== null) {
      return this.validateObject(value);
    }

    // Si el valor es una cadena, validamos directamente
    if (typeof value === 'string') {
      this.validateString(value);
    }

    return value;
  }

  private validateObject(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        this.validateString(value);
      } else if (typeof value === 'object' && value !== null) {
        obj[key] = this.validateObject(value); // Validación recursiva
      }
    }

    return obj;
  }

  private validateString(value: string): void {
    // Validar inyecciones SQL
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(value)) {
        throw new BadRequestException(
          `El valor "${value}" contiene patrones sospechosos que podrían ser utilizados en inyecciones SQL.`,
        );
      }
    }

    // Validar XSS
    for (const pattern of this.xssPatterns) {
      if (pattern.test(value)) {
        throw new BadRequestException(
          `El valor "${value}" contiene patrones sospechosos que podrían ser utilizados en ataques XSS.`,
        );
      }
    }
  }
}
