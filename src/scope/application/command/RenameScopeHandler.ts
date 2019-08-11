import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { RenameScopeCommand } from './RenameScopeCommand';

@CommandHandler(RenameScopeCommand)
export class RenameScopeHandler implements ICommandHandler<RenameScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RenameScopeCommand) {
    const { scopeId, name } = command;

    const instance = await this.eventStore.find(scopeId);
    if (instance instanceof Scope === false) {
      throw ScopeIdNotFoundException.withScopeId(scopeId);
    }

    const scope = this.publisher.mergeObjectContext(instance);
    scope.rename(name);

    this.eventStore.save(scope);
  }
}
