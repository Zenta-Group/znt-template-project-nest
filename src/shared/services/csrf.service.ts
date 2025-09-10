// src/shared/services/csrf.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CsrfToken } from '../models/csrf-token.model';
import * as crypto from 'crypto';
import { IBaseRepository } from '../interfaces/repository.ports';

@Injectable()
export class CsrfService {
  constructor(
    @Inject('CSRF_TOKEN_REPOSITORY')
    private readonly csrfTokenRepository: IBaseRepository<
      CsrfToken,
      any,
      string
    >,
  ) {}

  async generateCsrfToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const csrfToken: CsrfToken = {
      id: userId,
      token,
      createdAt: new Date(),
    };
    await this.csrfTokenRepository.upsert(userId, csrfToken);
    return token;
  }

  async validateCsrfToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.csrfTokenRepository.findById(userId);
    return !!storedToken && storedToken.token === token;
  }
}
