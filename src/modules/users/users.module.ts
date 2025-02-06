import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SharedModule } from 'src/shared/shared.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
