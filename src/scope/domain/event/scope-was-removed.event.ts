import { DomainEvent } from '../../../core/domain/models/domain-event';

export class ScopeWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}
