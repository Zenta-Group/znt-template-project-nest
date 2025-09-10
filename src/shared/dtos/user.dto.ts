import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  documentId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  role?: string;
  @ApiProperty()
  aditionalData?: any;

  static fromDomain(u: User): UserDto {
    const { password, ...rest } = u;
    return { ...rest };
  }
}

export class UserPageDto {
  @ApiProperty({ type: [UserDto] })
  data!: UserDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;

  static from(
    users: UserDto[],
    total: number,
    limit: number,
    offset: number,
  ): UserPageDto {
    return { data: users, total, limit, offset };
  }
}
