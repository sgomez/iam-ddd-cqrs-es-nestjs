import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';

import { EventStore } from '../core/eventstore/eventstore';
import { EventStoreModule } from '../core/eventstore/eventstore.module';
import { CommandHandlers } from './application/command';
import {
  ScopeWasCreated,
  ScopeWasRemoved,
  ScopeWasRenamed,
} from './domain/event';
import { ScopeAlias } from './domain/model/ScopeAlias';
import { ScopeId } from './domain/model/ScopeId';
import { ScopeName } from './domain/model/ScopeName';
import { ScopeController } from './infrastructure/controller/scope.controller';
import { ScopeEventStore } from './infrastructure/eventstore/ScopesEventStore';
import { ScopeService } from './infrastructure/services/scope.service';

@Module({
  controllers: [ScopeController],
  imports: [CqrsModule, EventStoreModule.forFeature()],
  providers: [ScopeService, ...CommandHandlers, ScopeEventStore],
})
export class ScopeModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    /** ------------ */
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
    /** ------------ */
    this.command$.register(CommandHandlers);
  }

  eventHandlers = {
    ScopeWasCreated: (id: ScopeId, name: ScopeName, alias: ScopeAlias) =>
      new ScopeWasCreated(id, name, alias),
    ScopeWasRenamed: (id: ScopeId, name: ScopeName) =>
      new ScopeWasRenamed(id, name),
    ScopeWasRemoved: (id: ScopeId) => new ScopeWasRemoved(id),
  };
}
