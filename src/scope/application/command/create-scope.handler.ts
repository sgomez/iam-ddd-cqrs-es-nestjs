import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ScopeAliasAlreadyRegisteredError,
  ScopeIdAlreadyRegisteredError,
} from '../../domain/exception';
import { Scope, ScopeAlias, ScopeId, ScopeName } from '../../domain/model';
import { SCOPES, Scopes } from '../../domain/repository';
import {
  CHECK_UNIQUE_SCOPE_ALIAS,
  CheckUniqueScopeAlias,
} from '../../domain/services/check-unique-scope-alias.service';
import { CreateScopeCommand } from './create-scope.command';

@CommandHandler(CreateScopeCommand)
export class CreateScopeHandler implements ICommandHandler<CreateScopeCommand> {
  constructor(
    @Inject(SCOPES) private readonly scopes: Scopes,
    @Inject(CHECK_UNIQUE_SCOPE_ALIAS)
    private readonly checkUniqueScopeAlias: CheckUniqueScopeAlias,
  ) {}

  async execute(command: CreateScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);
    const alias = ScopeAlias.fromString(command.alias);

    if ((await this.scopes.find(scopeId)) instanceof Scope) {
      throw ScopeIdAlreadyRegisteredError.withString(command.scopeId);
    }

    if ((await this.checkUniqueScopeAlias.with(alias)) instanceof ScopeId) {
      throw ScopeAliasAlreadyRegisteredError.withString(command.alias);
    }

    const scope = Scope.add(scopeId, name, alias);

    this.scopes.save(scope);
  }
}
