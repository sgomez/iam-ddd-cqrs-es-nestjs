import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { ScopeView } from '../../infrastructure/read-model/schema/ScopeSchema';
import { RenameScopeCommand } from '../command';

@CommandHandler(RenameScopeCommand)
export class RenameScopeHandler implements ICommandHandler<RenameScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async execute(command: RenameScopeCommand) {
    const scopeView = await this.scopeModel.findById(command.scopeId).exec();

    if (scopeView === null) {
      throw ScopeIdNotFoundException.withString(command.scopeId);
    }

    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);

    const instance = await this.eventStore.find(scopeId);
    if (instance instanceof Scope === false) {
      throw ScopeIdNotFoundException.withScopeId(scopeId);
    }

    const scope = this.publisher.mergeObjectContext(instance);
    scope.rename(name);

    this.eventStore.save(scope);
  }
}
