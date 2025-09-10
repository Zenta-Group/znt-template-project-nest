import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { SharedModule } from 'src/shared/shared.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [SharedModule, CoreModule],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
