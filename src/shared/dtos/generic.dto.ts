import { ApiProperty } from '@nestjs/swagger';
import { Generic } from '../models/generic.model';

export class GenericDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  status: string;

  static fromDomain(g: Generic): GenericDto {
    return { ...g };
  }
}

export class GenericPageDto {
  @ApiProperty({ type: [GenericDto] })
  data!: GenericDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;

  static from(
    generics: GenericDto[],
    total: number,
    limit: number,
    offset: number,
  ): GenericPageDto {
    return { data: generics, total, limit, offset };
  }
}
