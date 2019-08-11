import { ICommand } from '@nestjs/cqrs';

import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';

export class RenameScopeCommand implements ICommand {
  constructor(
    public readonly scopeId: ScopeId,
    public readonly name: ScopeName,
  ) {}
}
