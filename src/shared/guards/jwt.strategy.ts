// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secretKeyAuth'),
    });
  }

  async validate(payload: any) {
    // Aquí podemos añadir validaciones extra si queremos
    // Nest inyecta `payload` en request.user
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
