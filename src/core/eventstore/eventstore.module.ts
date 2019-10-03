import { DynamicModule } from "@nestjs/common";

import { EventStore } from "./eventstore";
import { eventStoreProvider } from "./eventstore.provider";

export class EventStoreModule {
  static forRoot(): DynamicModule {
    return {
      module: EventStoreModule,
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: EventStoreModule,
      providers: [EventStore, eventStoreProvider],
      exports: [EventStore, eventStoreProvider],
    };
  }
}
