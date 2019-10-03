import { Global, Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';

import { BootstrapModule } from './bootstrap.module';
import { DatabaseModule } from './core/database/database.module';
import { EventStore } from './core/eventstore/eventstore';
import { EventStoreModule } from './core/eventstore/eventstore.module';
import { ScopeModule } from './scope/scope.module';

@Global()
@Module({
  imports: [
    BootstrapModule,
    DatabaseModule,
    EventStoreModule.forFeature(),
    ScopeModule,
    CqrsModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    /** ------------ */
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
  }
}
