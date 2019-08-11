import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ScopeIdAlreadyRegisteredException } from '../../domain/exception/ScopeIdAlreadyRegisteredException';
import { Scope } from '../../domain/model/Scope';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { CreateScopeCommand } from './CreateScopeCommand';

@CommandHandler(CreateScopeCommand)
export class CreateScopeHandler implements ICommandHandler<CreateScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateScopeCommand) {
    const { scopeId, name, alias } = command;

    const instance = await this.eventStore.find(scopeId);

    if (instance instanceof Scope) {
      throw ScopeIdAlreadyRegisteredException.withScopeId(scopeId);
    }

    const scope = this.publisher.mergeObjectContext(
      Scope.add(scopeId, name, alias),
    );

    this.eventStore.save(scope);
  }
}
