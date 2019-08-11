import { IEvent } from '@nestjs/cqrs';

import { ScopeId } from '../model/ScopeId';
import { ScopeName } from '../model/ScopeName';

export class ScopeWasRenamed implements IEvent {
  constructor(public readonly id: ScopeId, public readonly name: ScopeName) {}
}
