import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventStoreModule } from './core/eventstore/eventstore.module';
import { ScopeModule } from './scope/scope.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [EventStoreModule.forRoot(), ScopeModule],
})
export class AppModule {}
