import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { LoginRq } from 'src/shared/dtos/login-rq';
import { LoginRs } from 'src/shared/dtos/login-rs';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';

/**
 * Controlador para la autenticación de usuarios.
 * Aquí incluimos el login con Google OAuth, validado por Nest.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('google')
  @ApiOperation({
    summary: 'Inicia sesión utilizando un idToken de Google OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna un objeto LoginRs con el JWT y datos del usuario',
    type: LoginRs,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación en el idToken',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o usuario no encontrado',
  })
  @UsePipes(new SecurityValidationPipe())
  async loginWithGoogle(@Body() dto: LoginRq): Promise<LoginRs> {
    return this.googleAuthService.signIn(dto.idToken);
  }
}
