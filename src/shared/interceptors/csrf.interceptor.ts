import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CsrfService } from '../services/csrf.service';

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  constructor(private readonly csrfService: CsrfService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const csrfToken = request.headers['x-csrf-token'];

    if (!csrfToken) {
      throw new BadRequestException('Token CSRF ausente.');
    }

    const isValid = await this.csrfService.validateCsrfToken(userId, csrfToken);
    if (!isValid) {
      throw new BadRequestException('Token CSRF inválido.');
    }

    return next.handle();
  }
}
