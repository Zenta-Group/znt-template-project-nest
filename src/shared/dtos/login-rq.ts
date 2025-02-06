import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRq {
  @ApiProperty({
    description: 'id_token proporcionado por Google OAuth',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIxMTI3YzYxMz...',
  })
  @IsString()
  id_token: string;
}
