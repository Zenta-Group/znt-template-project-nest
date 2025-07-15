import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateGenericDto {

  @ApiProperty({ example: 'Jdoe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  status: string;
}
