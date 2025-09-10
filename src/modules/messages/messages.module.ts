import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
