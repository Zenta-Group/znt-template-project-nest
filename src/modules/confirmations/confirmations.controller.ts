import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { ConfirmationsService } from './confirmations.service';
import { SearchConfirmationsDto } from './dtos/search-confirmations.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';

@ApiTags('Confirmaciones')
@ApiBearerAuth()
@ApiSecurity('x-csrf-token')
@Controller('confirmaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CsrfInterceptor)
@Roles('ADMIN', 'USER')
export class ConfirmationsController {
  constructor(private readonly confirmationsService: ConfirmationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Search confirmations by RUT or phone with date filters',
  })
  @ApiQuery({ name: 'mode', enum: ['rut', 'phone'], required: true })
  @ApiQuery({ name: 'query', type: String, required: true })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
    description: 'Pagination offset',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Result count',
    example: 50,
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: false,
    description:
      'Start date of the range (format yyyy-MM-dd). Starts at 00:00:00.000. No initial limit if not specified.',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: false,
    description:
      'End date of the range (format yyyy-MM-dd). Ends at 23:59:59.999. Defaults to current date.',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'dateField',
    enum: [
      'createdDatetime',
      'startDatetime',
      'appointmentDatetime',
      'deliveredDatetime',
    ],
    required: false,
    description: 'Date field to filter by',
    example: 'createdDatetime',
  })
  @ApiResponse({
    status: 200,
    description: 'List of found confirmations.',
  })
  async search(@Query() params: SearchConfirmationsDto) {
    return this.confirmationsService.search(params);
  }
}
