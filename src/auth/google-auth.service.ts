// src/auth/google-auth.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { IAuthService } from 'src/shared/interfaces/i-auth-service.interface';
import { LoginRs, UserData } from 'src/shared/dtos/login-rs';
import { User } from 'src/shared/models/user.model';
import {
  InvalidTokenException,
  UserNotFoundException,
  GenericAuthException,
} from 'src/shared/exceptions/auth-exceptions';
import { CsrfService } from 'src/shared/services/csrf.service';
import { IBaseRepository } from 'src/shared/interfaces/repository.ports';

@Injectable()
export class GoogleAuthService implements IAuthService<string> {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly jwtSecret: string;
  private readonly tokenExpiration: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IBaseRepository<User, any, string>,
    private readonly csrfService: CsrfService,
  ) {
    this.jwtSecret = this.configService.get<string>('secretKeyAuth') ?? '';
    this.tokenExpiration =
      this.configService.get<string>('tokenExpiration') ?? '1h';
  }

  public async signIn(tokenSesion: string): Promise<LoginRs> {
    const rs = new LoginRs();
    const clientId = this.configService.get<string>('googleClientId') ?? '';
    if (!clientId) {
      this.logger.error('Falta configurar GOOGLE_CLIENT_ID');
      throw new GenericAuthException('Falta configurar GOOGLE_CLIENT_ID');
    }

    const client = new OAuth2Client(clientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenSesion,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        throw new InvalidTokenException('El token de Google no contiene email');
      }

      const email = payload.email;
      const user = await this.userRepository.findOne({
        filter: { email: email },
      });
      if (!user) {
        throw new UserNotFoundException(email);
      }

      const csrfToken = await this.csrfService.generateCsrfToken(user.id);

      rs.code = 0;
      rs.message = 'Sesión correcta (Google)';
      const userData: UserData = new UserData();
      userData.id = user.id;
      userData.name = user.name;
      userData.lastname = user.lastname;
      userData.username = user.username;
      userData.email = user.email;
      userData.status = user.status;
      userData.role = user.role;
      rs.data = userData;
      rs.token = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role ?? 'USER' },
        {
          secret: this.jwtSecret,
          expiresIn: this.tokenExpiration,
        },
      );
      rs.csrfToken = csrfToken;

      return rs;
    } catch (error) {
      console.log(error);
      this.logger.error('Error signIn GoogleAuthService', error?.message);
      rs.code = 1;
      rs.data = null;
      rs.token = null;

      if (
        error instanceof InvalidTokenException ||
        error instanceof UserNotFoundException
      ) {
        rs.message = error.message;
      } else {
        rs.message = 'Usuario Google inválido';
      }
      return rs;
    }
  }
}
