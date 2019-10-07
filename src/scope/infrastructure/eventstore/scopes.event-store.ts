import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Scope } from '../../domain/model/scope';
import { ScopeId } from '../../domain/model/scope-id';
import { Scopes } from '../../domain/repository/scopes';

@Injectable()
export class ScopeEventStore implements Scopes {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(scopeId: ScopeId): Promise<Scope> {
    return this.eventStore.read(Scope, scopeId.value);
  }

  async find(scopeId: ScopeId): Promise<Scope> | null {
    return this.eventStore.read(Scope, scopeId.value);
  }

  save(scope: Scope): void {
    scope = this.publisher.mergeObjectContext(scope);
    scope.commit();
  }

  nextIdentity(): ScopeId {
    return ScopeId.generate();
  }
}

/*
    const scope = this.publisher.mergeObjectContext(
    );

*/
