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


import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';
import { GenericsService } from './generics.service';
import { CreateGenericDto } from './dtos/create-generic.dto';
import { Generic } from 'src/shared/entities/generic.entity';
import { UpdateGenericDto } from './dtos/update-generic.dto';

@ApiTags('Generics')
@ApiBearerAuth()
@ApiSecurity('x-csrf-token')
@Controller('generics')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CsrfInterceptor)
export class GenericsController {
  constructor(private readonly service: GenericsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo registro' })
  @ApiBody({ type: CreateGenericDto })
  @ApiResponse({
    status: 201,
    description: 'Registro creado exitosamente',
    type: Generic,
  })
  @ApiResponse({ status: 400, description: 'Error de validación en DTO' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (role no permitido)',
  })
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createGenericDto: CreateGenericDto): Promise<Generic> {
    return this.service.create(createGenericDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Listar todos los registros' })
  @ApiResponse({
    status: 200,
    description: 'Retorna un array de registros',
    type: [Generic],
  })
  @UsePipes(new SecurityValidationPipe())
  async findAll(): Promise<Generic[]> {
    return this.service.getAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener detalle de un registro por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el registro solicitado',
    type: Generic,
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async findOne(@Param('id') id: string): Promise<Generic | null> {
    return this.service.getById(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar un registro' })
  @ApiParam({ name: 'id', description: 'ID del registro' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente',
    type: Generic,
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateGenericDto: UpdateGenericDto,
  ): Promise<Generic> {
    return this.service.update(id, updateGenericDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar un registro' })
  @ApiParam({ name: 'id', description: 'ID del registro' })
  @ApiResponse({ status: 200, description: 'Registro eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
