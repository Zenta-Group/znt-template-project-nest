import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jdoe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastname: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiPropertyOptional({ example: 'USER', description: 'Rol del usuario' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'yourStrongPass123!' })
  @IsString()
  @Length(8, 32) // ejemplo: mínimo 8 caracteres
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
