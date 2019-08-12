import { DomainEvent } from '../../../core/ddd/DomainEvent';

export class ScopeWasRenamed implements DomainEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}
