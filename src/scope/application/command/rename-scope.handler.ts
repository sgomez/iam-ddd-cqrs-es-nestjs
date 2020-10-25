import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ScopeIdNotFoundError,
} from '../../domain/exception/scope-id-not-found.error';
import { Scope, ScopeId, ScopeName } from '../../domain/model';
import { SCOPES, Scopes } from '../../domain/repository';
import { RenameScopeCommand } from './rename-scope.command';

@CommandHandler(RenameScopeCommand)
export class RenameScopeHandler implements ICommandHandler<RenameScopeCommand> {
  constructor(@Inject(SCOPES) private readonly scopes: Scopes) {}

  async execute(command: RenameScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const scope = await this.scopes.find(scopeId);
    const name = ScopeName.fromString(command.name);

    if (!(scope instanceof Scope) || scope.isRemoved) {
      throw ScopeIdNotFoundError.withString(command.scopeId);
    }

    scope.rename(name);
    this.scopes.save(scope);
  }
}
