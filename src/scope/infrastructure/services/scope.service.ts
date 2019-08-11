import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateScopeCommand } from '../../application/command/CreateScopeCommand';
import { RemoveScopeCommand } from '../../application/command/RemoveScopeCommand';
import { RenameScopeCommand } from '../../application/command/RenameScopeCommand';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';

@Injectable()
export class ScopeService {
  constructor(private readonly commandBus: CommandBus) {}

  async createScope(id: string, name: string, alias: string) {
    return this.commandBus.execute(
      new CreateScopeCommand(
        ScopeId.fromString(id),
        ScopeName.fromString(name),
        ScopeAlias.fromString(alias),
      ),
    );
  }

  async renameScope(id: string, name: string) {
    return this.commandBus.execute(
      new RenameScopeCommand(
        ScopeId.fromString(id),
        ScopeName.fromString(name),
      ),
    );
  }

  async removeScope(id: string) {
    return this.commandBus.execute(
      new RemoveScopeCommand(ScopeId.fromString(id)),
    );
  }
}
