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

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';
import { UserDto } from 'src/shared/dtos/user.dto';

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
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Error de validación en DTO' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (role no permitido)',
  })
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto);
    return UserDto.fromDomain(user);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Retorna un array de usuarios',
    type: [UserDto],
  })
  @UsePipes(new SecurityValidationPipe())
  async findAll(): Promise<UserDto[]> {
    const page = await this.usersService.getAllUsers();
    const data = page.data.map(UserDto.fromDomain);
    return data;
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener detalle de un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el usuario solicitado',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async findOne(@Param('id') id: string): Promise<UserDto | null> {
    const user = await this.usersService.getUserById(id);
    return UserDto.fromDomain(user);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return UserDto.fromDomain(user);
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
