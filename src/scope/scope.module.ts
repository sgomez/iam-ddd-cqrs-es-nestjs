import { Module, OnModuleInit } from "@nestjs/common";
import { CommandBus, CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { EventStore } from "../core/eventstore/eventstore";
import { EventStoreModule } from "../core/eventstore/eventstore.module";
import { CommandHandlers } from "./application/handler";
import {
  ScopeWasCreated,
  ScopeWasRemoved,
  ScopeWasRenamed,
} from "./domain/event";
import { ScopeController } from "./infrastructure/controller/ScopeController";
import { ScopeEventStore } from "./infrastructure/eventstore/ScopesEventStore";
import { ProjectionHandlers } from "./infrastructure/read-model/projection";
import { ScopeSchema } from "./infrastructure/read-model/schema/ScopeSchema";
import { ScopeService } from "./infrastructure/service/ScopeService";

@Module({
  controllers: [ScopeController],
  imports: [
    CqrsModule,
    EventStoreModule.forFeature(),
    MongooseModule.forFeature([{ name: 'Scope', schema: ScopeSchema }]),
  ],
  providers: [
    ScopeService,
    ...CommandHandlers,
    ...ProjectionHandlers,
    ScopeEventStore,
  ],
})
export class ScopeModule implements OnModuleInit {
  constructor(
    private readonly command$: CommandBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    /** ------------ */
    this.eventStore.addEventHandlers(this.eventHandlers);
    /** ------------ */
    this.command$.register(CommandHandlers);
  }

  eventHandlers = {
    ScopeWasCreated: (id: string, name: string, alias: string) =>
      new ScopeWasCreated(id, name, alias),
    ScopeWasRenamed: (id: string, name: string) =>
      new ScopeWasRenamed(id, name),
    ScopeWasRemoved: (id: string) => new ScopeWasRemoved(id),
  };
}
