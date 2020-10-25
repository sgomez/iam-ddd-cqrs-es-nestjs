import { Injectable } from '@nestjs/common';
import { EventStore, StoreEventPublisher } from 'event-sourcing-nestjs';

import { Scope } from '../../domain/model/scope';
import { ScopeId } from '../../domain/model/scope-id';
import { Scopes } from '../../domain/repository/scopes';

@Injectable()
export class ScopeEventStore implements Scopes {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: StoreEventPublisher,
  ) {}

  async get(scopeId: ScopeId): Promise<Scope> {
    const scope = Reflect.construct(Scope, []);
    scope.loadFromHistory(
      await this.eventStore.getEvents('scope', scopeId.value),
    );

    return scope;
  }

  async find(scopeId: ScopeId): Promise<Scope> | null {
    const events = await this.eventStore.getEvents('scope', scopeId.value);

    if (events.length === 0) {
      return null;
    }

    const scope = Reflect.construct(Scope, []);
    scope.loadFromHistory(events);

    return scope;
  }

  save(scope: Scope): void {
    scope = this.publisher.mergeObjectContext(scope);
    scope.commit();
  }

  nextIdentity(): ScopeId {
    return ScopeId.generate();
  }
}
