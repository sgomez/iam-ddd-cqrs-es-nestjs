import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { ScopeView } from '../../infrastructure/read-model/schema/ScopeSchema';
import { RemoveScopeCommand } from '../command';

@CommandHandler(RemoveScopeCommand)
export class RemoveScopeHandler implements ICommandHandler<RemoveScopeCommand> {
  constructor(
    private readonly eventStore: ScopeEventStore,
    private readonly publisher: EventPublisher,
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async execute(command: RemoveScopeCommand) {
    const scopeView = await this.scopeModel.findById(command.scopeId).exec();

    if (scopeView === null) {
      throw ScopeIdNotFoundException.withString(command.scopeId);
    }

    const scopeId = ScopeId.fromString(command.scopeId);

    const scope = this.publisher.mergeObjectContext(
      await this.eventStore.find(scopeId),
    );

    if (scope instanceof Scope === false) {
      throw ScopeIdNotFoundException.withScopeId(scopeId);
    }

    scope.remove();

    this.eventStore.save(scope);
  }
}
