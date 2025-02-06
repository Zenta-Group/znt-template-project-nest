import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-users.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
