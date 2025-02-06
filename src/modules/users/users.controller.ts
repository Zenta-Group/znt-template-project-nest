import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/update-users.dto';
import { User } from 'src/shared/entities/user.entity';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';

@ApiTags('Users')
@ApiBearerAuth()
@ApiSecurity('x-csrf-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CsrfInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Error de validación en DTO' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (role no permitido)',
  })
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Retorna un array de usuarios',
    type: [User],
  })
  @UsePipes(new SecurityValidationPipe())
  async findAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener detalle de un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el usuario solicitado',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
