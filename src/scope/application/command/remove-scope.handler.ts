import {
  AggregateRepository,
  InjectAggregateRepository,
} from '@aulasoftwarelibre/nestjs-eventstore';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ScopeIdNotFoundError } from '../../domain/exception/scope-id-not-found.error';
import { Scope } from '../../domain/model';
import { ScopeId } from '../../domain/model/scope-id';
import { RemoveScopeCommand } from './remove-scope.command';

@CommandHandler(RemoveScopeCommand)
export class RemoveScopeHandler implements ICommandHandler<RemoveScopeCommand> {
  constructor(
    @InjectAggregateRepository(Scope)
    private readonly scopes: AggregateRepository<Scope, ScopeId>,
  ) {}

  async execute(command: RemoveScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const scope = await this.scopes.find(scopeId);

    if (!(scope instanceof Scope) || scope.isRemoved) {
      throw ScopeIdNotFoundError.withString(command.scopeId);
    }

    scope.remove();
    this.scopes.save(scope);
  }
}
