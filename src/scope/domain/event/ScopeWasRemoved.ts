import { IEvent } from '@nestjs/cqrs';
import { ScopeId } from '../model/ScopeId';

export class ScopeWasRemoved implements IEvent {
  constructor(public readonly scopeId: ScopeId) {}
}
