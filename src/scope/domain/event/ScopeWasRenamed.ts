import { DomainEvent } from "../../../core/domain/models/domain-event";

export class ScopeWasRenamed implements DomainEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}
