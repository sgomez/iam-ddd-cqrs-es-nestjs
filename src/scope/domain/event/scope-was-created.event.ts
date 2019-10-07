import { DomainEvent } from '../../../core/domain/models/domain-event';

export class ScopeWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly alias: string,
  ) {}
}
