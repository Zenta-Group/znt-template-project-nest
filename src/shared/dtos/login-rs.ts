// src/shared/dtos/login-rs.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  status?: boolean;
  @ApiProperty({ nullable: true })
  role?: string;
}

export class LoginRs {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ nullable: true })
  token?: string | null;

  @ApiProperty({ nullable: true })
  data?: UserData;

  @ApiProperty({ nullable: true })
  csrfToken?: string;
}
