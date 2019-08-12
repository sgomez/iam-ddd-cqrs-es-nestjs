import { DomainEvent } from '../../../core/ddd/DomainEvent';

export class ScopeWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}
