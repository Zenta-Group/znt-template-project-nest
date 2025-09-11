// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthService } from './google-auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CoreModule } from 'src/core/core.module';

// Ejemplo de cómo inyectamos la secreta JWT desde variables de entorno
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secretKeyAuth'),
        signOptions: {
          expiresIn: configService.get<string>('tokenExpiration') ?? '1h',
        },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    CoreModule,
  ],
  providers: [GoogleAuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
