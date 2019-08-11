import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStoreModule } from './core/eventstore/eventstore.module';
import { ScopeModule } from './scope/scope.module';

@Module({
  imports: [EventStoreModule.forRoot(), ScopeModule, CqrsModule],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {}
}
