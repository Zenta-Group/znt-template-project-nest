import { Module } from '@nestjs/common';
import { ConfirmationsController } from './confirmations.controller';
import { ConfirmationsService } from './confirmations.service';
import { SharedModule } from 'src/shared/shared.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [ConfirmationsController],
  providers: [ConfirmationsService],
})
export class ConfirmationsModule {}
