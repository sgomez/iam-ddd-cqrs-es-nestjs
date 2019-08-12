import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ScopeIdAlreadyRegisteredException } from '../../domain/exception/ScopeIdAlreadyRegisteredException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { CreateScopeCommand } from '../command';

@CommandHandler(CreateScopeCommand)
export class CreateScopeHandler implements ICommandHandler<CreateScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);
    const alias = ScopeAlias.fromString(command.alias);

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
