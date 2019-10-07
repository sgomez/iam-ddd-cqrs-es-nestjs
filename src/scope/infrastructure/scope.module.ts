import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../../core/database/database.module';
import { EventStore } from '../../core/eventstore/eventstore';
import { EventStoreModule } from '../../core/eventstore/eventstore.module';
import { CommandHandlers } from '../application/command';
import { scopeEventHandlers } from '../domain/event';
import { ScopeController } from './controller/scope.controller';
import { ScopeEventStore } from './eventstore/scopes.event-store';
import { ProjectionHandlers } from './read-model/projection';
import { ScopeProviders } from './scope.provider';
import { ScopeService } from './service/scope.service';

@Module({
  controllers: [ScopeController],
  imports: [CqrsModule, DatabaseModule, EventStoreModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...ScopeProviders,
    ScopeService,
    ScopeEventStore,
  ],
})
export class ScopeModule implements OnModuleInit {
  constructor(private readonly eventStore: EventStore) {}

  onModuleInit() {
    this.eventStore.addEventHandlers(scopeEventHandlers);
  }
}
