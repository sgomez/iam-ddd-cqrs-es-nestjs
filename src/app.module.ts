import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { EventStore } from "./core/eventstore/eventstore";
import { EventStoreModule } from "./core/eventstore/eventstore.module";
import { ScopeModule } from "./scope/scope.module";

@Module({
  imports: [
    EventStoreModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/iam'),
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
