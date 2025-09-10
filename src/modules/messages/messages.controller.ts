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
import { MessagesService } from './messages.service';
import { SearchMessagesDto } from './dtos/search-messages.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';

@ApiTags('Mensajes')
@ApiBearerAuth()
@ApiSecurity('x-csrf-token')
@Controller('mensajes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CsrfInterceptor)
@Roles('ADMIN', 'USER')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Returns messages by confirmation_id with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get messages by confirmation_id (UUID)' })
  @ApiQuery({
    name: 'confirmation_id',
    type: String,
    required: true,
    description: 'Confirmation ID (UUID)',
    example: 'b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
  })
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
  @ApiResponse({ status: 200, description: 'List of found messages.' })
  async getMessages(@Query() params: SearchMessagesDto) {
    return this.messagesService.getMessages(params);
  }
}
