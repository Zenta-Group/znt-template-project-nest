import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/shared/models/person.model';

export class PersonDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  role!: 'USER' | 'ADMIN';

  @ApiProperty()
  status!: boolean;

  @ApiProperty({ example: {} })
  additionalData?: any;

  static fromDomain(u: Person): PersonDto {
    return { ...u };
  }
}
