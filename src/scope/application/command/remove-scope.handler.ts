import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ScopeIdNotFoundError,
} from '../../domain/exception/scope-id-not-found.error';
import { Scope } from '../../domain/model';
import { ScopeId } from '../../domain/model/scope-id';
import { SCOPES, Scopes } from '../../domain/repository';
import { RemoveScopeCommand } from './remove-scope.command';

@CommandHandler(RemoveScopeCommand)
export class RemoveScopeHandler implements ICommandHandler<RemoveScopeCommand> {
  constructor(@Inject(SCOPES) private readonly scopes: Scopes) {}

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
