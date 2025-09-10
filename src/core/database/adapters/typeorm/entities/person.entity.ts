import { Entity, PrimaryColumn, Column, Index, OneToMany } from 'typeorm';

export enum PersonRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'people' })
@Index('UQ_people_email', ['email'], { unique: true })
export class PersonEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 320, nullable: false })
  email!: string;

  @Column({ type: 'enum', enum: PersonRole, nullable: false })
  role!: PersonRole;

  @Column({ type: 'boolean', nullable: false })
  status!: boolean;
}
