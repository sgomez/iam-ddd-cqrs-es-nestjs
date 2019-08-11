import { ICommand } from '@nestjs/cqrs';

import { ScopeId } from '../../domain/model/ScopeId';

export class RemoveScopeCommand implements ICommand {
  constructor(public readonly scopeId: ScopeId) {}
}
