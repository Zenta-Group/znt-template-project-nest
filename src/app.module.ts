import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GenericsModule } from './modules/generics/generics.module';
import { ConfirmationsModule } from './modules/confirmations/confirmations.module';
import { PeopleModule } from './modules/people/people.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    UsersModule,
    GenericsModule,
    ConfirmationsModule,
    PeopleModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
