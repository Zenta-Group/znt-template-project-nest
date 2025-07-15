import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GenericsModule } from './modules/generics/generics.module';

@Module({
  imports: [CoreModule, SharedModule, AuthModule, UsersModule, GenericsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
