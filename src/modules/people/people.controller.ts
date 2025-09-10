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
  Query,
  Patch,
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

import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dtos/create-people.dto';
import { UpdatePeopleDto } from './dtos/update-people.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';
import { PersonPageDto } from './dtos/person-page.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PersonDto } from './dtos/person.dto';

@ApiTags('People')
@ApiBearerAuth()
@ApiSecurity('x-csrf-token')
@Controller('people')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'USER')
@UseInterceptors(CsrfInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  /**
   * Creates a new user
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreatePeopleDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'DTO validation error' })
  @ApiResponse({ status: 403, description: 'Access denied (role not allowed)' })
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createPeopleDto: CreatePeopleDto): Promise<PersonDto> {
    const allowedRoles: Array<'USER' | 'ADMIN'> = ['USER', 'ADMIN'];
    const role = allowedRoles.includes(createPeopleDto.role as any)
      ? (createPeopleDto.role as 'USER' | 'ADMIN')
      : 'USER';
    const user = await this.peopleService.createUser(
      createPeopleDto.name,
      createPeopleDto.email,
      role,
    );
    return PersonDto.fromDomain(user);
  }

  @Get()
  @ApiOperation({
    summary: 'List users (paginated)',
    description:
      'Lists users with pagination and text search option in name, email or role using LIKE %query%',
  })
  @ApiResponse({
    status: 200,
    description: 'User page',
    type: PersonPageDto,
  })
  @UsePipes(new SecurityValidationPipe())
  async findAll(@Query() query: PaginationQueryDto): Promise<PersonPageDto> {
    const page = await this.peopleService.getAllUsers(query);
    const data = page.data.map(PersonDto.fromDomain);
    return PersonPageDto.from(data, page.total, page.limit, page.offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested user',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new SecurityValidationPipe())
  async findOne(@Param('id') id: string): Promise<PersonDto> {
    const user = await this.peopleService.getUserById(id);
    return PersonDto.fromDomain(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new SecurityValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updatePeopleDto: UpdatePeopleDto,
  ): Promise<PersonDto> {
    const user = await this.peopleService.updateUser(id, updatePeopleDto);
    return PersonDto.fromDomain(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new SecurityValidationPipe())
  async remove(@Param('id') id: string): Promise<void> {
    return this.peopleService.deleteUser(id);
  }
}
