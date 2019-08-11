import { Injectable } from '@nestjs/common';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Scope } from '../../domain/model/Scope';
import { ScopeId } from '../../domain/model/ScopeId';
import { Scopes } from '../../domain/repository/Scopes';

@Injectable()
export class ScopeEventStore implements Scopes {
  constructor(private readonly eventStore: EventStore) {}

  async get(scopeId: ScopeId): Promise<Scope> {
    return await this.eventStore.read(Scope, scopeId.value);
  }

  async find(scopeId: ScopeId): Promise<Scope> | null {
    return await this.eventStore.read(Scope, scopeId.value);
  }

  save(scope: Scope): void {
    scope.commit();
  }

  nextIdentity(): ScopeId {
    return ScopeId.generate();
  }
}
