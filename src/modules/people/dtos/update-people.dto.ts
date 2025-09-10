import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePeopleDto } from './create-people.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePeopleDto extends PartialType(CreatePeopleDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
