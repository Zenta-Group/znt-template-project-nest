import { Module } from '@nestjs/common';
import { FirestoreModule } from './adapters/firestore/firestore.module';
import { TypeOrmModule } from './adapters/typeorm/typeorm.module';

@Module({
  imports: [FirestoreModule, TypeOrmModule],
  providers: [],
  exports: [FirestoreModule, TypeOrmModule],
})
export class DatabaseModule {}
