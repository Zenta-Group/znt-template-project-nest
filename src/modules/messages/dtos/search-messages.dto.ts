import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchMessagesDto {
  @ApiProperty({
    description: 'ID de la confirmación (UUID)',
    example: 'b3e1c2d4-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
  })
  @IsString()
  confirmation_id!: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 50;
}
