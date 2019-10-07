import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { ScopeWasCreated } from '../../../domain/event';
import { ScopeView } from '../schema/scope.schema';

@EventsHandler(ScopeWasCreated)
export class ScopeWasCreatedProjection
  implements IEventHandler<ScopeWasCreated> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasCreated) {
    const scopeView = new this.scopeModel({
      _id: event.id,
      name: event.name,
      alias: event.alias,
    });

    return scopeView.save();
  }
}
