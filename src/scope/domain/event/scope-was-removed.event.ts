import { StorableEvent } from 'event-sourcing-nestjs';

export class ScopeWasRemoved extends StorableEvent {
  eventAggregate = 'scope';
  eventVersion = 1;

  constructor(public readonly id: string) {
    super();
  }
}
