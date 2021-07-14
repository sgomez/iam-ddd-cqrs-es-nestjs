import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { GetScopeQuery, GetScopesQuery } from '../../application';
import {
  CreateScopeCommand,
  RemoveScopeCommand,
  RenameScopeCommand,
} from '../../application/command';
import { ScopeDto } from '../../dto';

@Injectable()
export class ScopeService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createScope(id: string, name: string, alias: string) {
    return this.commandBus.execute(new CreateScopeCommand(id, name, alias));
  }

  async renameScope(id: string, name: string) {
    return this.commandBus.execute(new RenameScopeCommand(id, name));
  }

  async removeScope(id: string) {
    return this.commandBus.execute(new RemoveScopeCommand(id));
  }

  async getScope(id: string): Promise<ScopeDto> {
    return this.queryBus.execute(new GetScopeQuery(id));
  }

  async getScopes(): Promise<ScopeDto[]> {
    return this.queryBus.execute(new GetScopesQuery());
  }
}
