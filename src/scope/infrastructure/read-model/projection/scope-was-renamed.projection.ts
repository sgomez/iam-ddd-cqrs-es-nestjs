import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { ScopeWasRenamed } from '../../../domain/event';
import { ScopeView } from '../schema/scope.schema';

@EventsHandler(ScopeWasRenamed)
export class ScopeWasRenamedProjection
  implements IEventHandler<ScopeWasRenamed> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRenamed) {
    this.scopeModel.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}
