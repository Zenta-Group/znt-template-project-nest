import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { CoreModule } from 'src/core/core.module';
import { GenericsController } from './generics.controller';
import { GenericsService } from './generics.service';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [GenericsController],
  providers: [GenericsService],
})
export class GenericsModule {}
