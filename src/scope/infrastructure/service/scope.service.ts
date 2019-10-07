import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import {
  CreateScopeCommand,
  RemoveScopeCommand,
  RenameScopeCommand,
} from '../../application/command';
import { SCOPE_MODEL, ScopeView } from '../read-model/schema/scope.schema';

@Injectable()
export class ScopeService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(SCOPE_MODEL) private readonly scopeModel: Model<ScopeView>,
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

  async getScope(id: string): Promise<ScopeView> {
    return this.scopeModel.findById(id).exec();
  }

  async getScopes(): Promise<ScopeView[]> {
    return this.scopeModel.find().exec();
  }
}
