import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('generics')
export class GenericEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @Column({ type: 'varchar', length: 128 })
  status!: string;
}
