// src/shared/services/csrf.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CsrfToken } from '../entities/csrf-token.entity';
import * as crypto from 'crypto';
import { IDatabaseService } from '../interfaces/i-database-service.interface';

@Injectable()
export class CsrfService {
  constructor(
    @Inject('CSRF_TOKEN_REPOSITORY')
    private readonly csrfTokenRepository: IDatabaseService<CsrfToken>,
  ) {}

  async generateCsrfToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const csrfToken: CsrfToken = {
      id: userId,
      token,
      createdAt: new Date(),
    };
    await this.csrfTokenRepository.createOrReplace(userId, csrfToken);
    return token;
  }

  async validateCsrfToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.csrfTokenRepository.getByField('id', userId);
    return !!storedToken && storedToken.token === token;
  }
}
