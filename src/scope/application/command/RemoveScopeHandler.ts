import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { RemoveScopeCommand } from './RemoveScopeCommand';

@CommandHandler(RemoveScopeCommand)
export class RemoveScopeHandler implements ICommandHandler<RemoveScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveScopeCommand) {
    const { scopeId } = command;

    const scope = this.publisher.mergeObjectContext(
      await this.eventStore.find(scopeId),
    );

    if (scope instanceof Scope === false) {
      throw ScopeIdNotFoundException.withScopeId(scopeId);
    }

    scope.remove();

    this.eventStore.save(scope);
  }
}
