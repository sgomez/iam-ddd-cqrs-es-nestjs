import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeAliasAlreadyRegisteredException } from '../../domain/exception/ScopeAliasAlreadyRegisteredException';
import { ScopeIdAlreadyRegisteredException } from '../../domain/exception/ScopeIdAlreadyRegisteredException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { ScopeView } from '../../infrastructure/read-model/schema/ScopeSchema';
import { CreateScopeCommand } from '../command';

@CommandHandler(CreateScopeCommand)
export class CreateScopeHandler implements ICommandHandler<CreateScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async execute(command: CreateScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);
    const alias = ScopeAlias.fromString(command.alias);

    const instance = await this.eventStore.find(scopeId);

    if (instance instanceof Scope) {
      throw ScopeIdAlreadyRegisteredException.withString(command.scopeId);
    }

    const scopeView = await this.scopeModel.findOne({ alias: command.alias });
    if (scopeView !== null) {
      throw ScopeAliasAlreadyRegisteredException.withString(command.alias);
    }

    const scope = this.publisher.mergeObjectContext(
      Scope.add(scopeId, name, alias),
    );

    this.eventStore.save(scope);
  }
}
