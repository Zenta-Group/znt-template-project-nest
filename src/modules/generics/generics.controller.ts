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
import { Generic } from 'src/shared/models/generic.model';
import { UpdateGenericDto } from './dtos/update-generic.dto';
import { GenericDto } from 'src/shared/dtos/generic.dto';

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
    type: GenericDto,
  })
  @ApiResponse({ status: 400, description: 'Error de validación en DTO' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (role no permitido)',
  })
  @UsePipes(new SecurityValidationPipe())
  async create(
    @Body() createGenericDto: CreateGenericDto,
  ): Promise<GenericDto> {
    const generic = await this.service.create(createGenericDto);
    return GenericDto.fromDomain(generic);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Listar todos los registros' })
  @ApiResponse({
    status: 200,
    description: 'Retorna un array de registros',
    type: [GenericDto],
  })
  @UsePipes(new SecurityValidationPipe())
  async findAll(): Promise<GenericDto[]> {
    const page = await this.service.getAll();
    const data = page.data.map(GenericDto.fromDomain);
    return data;
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener detalle de un registro por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el registro solicitado',
    type: GenericDto,
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async findOne(@Param('id') id: string): Promise<GenericDto | null> {
    const generic = await this.service.getById(id);
    return GenericDto.fromDomain(generic);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar un registro' })
  @ApiParam({ name: 'id', description: 'ID del registro' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente',
    type: GenericDto,
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @UsePipes(new SecurityValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateGenericDto: UpdateGenericDto,
  ): Promise<GenericDto> {
    const generic = await this.service.update(id, updateGenericDto);
    return GenericDto.fromDomain(generic);
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
