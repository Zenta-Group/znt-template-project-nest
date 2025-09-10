import { ApiProperty } from '@nestjs/swagger';
import { PersonDto } from './person.dto';

export class PersonPageDto {
  @ApiProperty({ type: [PersonDto] })
  data!: PersonDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;

  static from(
    users: PersonDto[],
    total: number,
    limit: number,
    offset: number,
  ): PersonPageDto {
    return { data: users, total, limit, offset };
  }
}
