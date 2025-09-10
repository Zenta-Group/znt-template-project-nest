import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class SearchConfirmationsDto {
  @ApiProperty({
    enum: ['rut', 'phone'],
    description: 'Modo de búsqueda: rut o phone',
  })
  @IsEnum(['rut', 'phone'])
  mode: 'rut' | 'phone';

  @ApiProperty({ description: 'Valor a buscar (RUT o teléfono)' })
  @IsString()
  query: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ default: 'id', example: 'name' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description:
      'Fecha de inicio del rango (formato yyyy-MM-dd). Comienza desde las 00:00:00.000. Sin límite inicial si no se especifica.',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'Fecha de fin del rango (formato yyyy-MM-dd). Termina a las 23:59:59.999. Por defecto es la fecha actual.',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: [
      'createdDatetime',
      'startDatetime',
      'appointmentDatetime',
      'deliveredDatetime',
    ],
    default: 'createdDatetime',
    description: 'Campo de fecha por el cual filtrar',
  })
  @IsOptional()
  @IsString()
  dateField?:
    | 'createdDatetime'
    | 'startDatetime'
    | 'appointmentDatetime'
    | 'deliveredDatetime';
}
