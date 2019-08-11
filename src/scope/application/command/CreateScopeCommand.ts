import { ICommand } from '@nestjs/cqrs';

import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';

export class CreateScopeCommand implements ICommand {
  constructor(
    public readonly scopeId: ScopeId,
    public readonly name: ScopeName,
    public readonly alias: ScopeAlias,
  ) {}
}
