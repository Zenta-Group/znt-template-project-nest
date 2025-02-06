import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'class-validator';
import { configuration } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      expandVariables: true,
    }),
    DatabaseModule,
    IntegrationModule,
  ],
  providers: [],
  exports: [DatabaseModule, IntegrationModule],
})
export class CoreModule {}
