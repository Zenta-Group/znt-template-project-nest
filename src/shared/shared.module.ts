import { Module } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';
import { CsrfService } from './services/csrf.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  providers: [JwtStrategy, CsrfService],
  exports: [JwtStrategy, CsrfService],
})
export class SharedModule {}
