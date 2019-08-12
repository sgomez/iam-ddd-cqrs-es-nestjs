import { DomainEvent } from '../../../core/ddd/DomainEvent';

export class ScopeWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly alias: string,
  ) {}
}
