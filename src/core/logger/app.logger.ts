import { LoggerService } from '@nestjs/common';
import type { Logger as Pino } from 'pino';

export class AppLogger implements LoggerService {
  constructor(private readonly pino: Pino) {}

  log(message: any, context?: string) {
    this.pino.info({ context }, message);
  }
  error(message: any, trace?: string, context?: string) {
    this.pino.error({ context, trace }, message);
  }
  warn(message: any, context?: string) {
    this.pino.warn({ context }, message);
  }
  debug(message: any, context?: string) {
    this.pino.debug({ context }, message);
  }
  verbose(message: any, context?: string) {
    // Pino no tiene "verbose"; usa trace para el nivel más bajo
    this.pino.trace({ context }, message);
  }
}
