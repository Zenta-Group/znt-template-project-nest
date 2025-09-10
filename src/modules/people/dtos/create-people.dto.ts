import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePeopleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  @IsEnum(['USER', 'ADMIN'] as any)
  role!: 'USER' | 'ADMIN';
}
