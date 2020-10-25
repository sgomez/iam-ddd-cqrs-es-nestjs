import { Inject } from '@nestjs/common';
import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';
import { Model } from 'mongoose';

import { ScopeWasCreated } from '../../../domain/event';
import { ScopeView } from '../schema/scope.schema';

@ViewUpdaterHandler(ScopeWasCreated)
export class ScopeWasCreatedProjection
  implements IViewUpdater<ScopeWasCreated> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasCreated) {
    const scopeView = new this.scopeModel({
      _id: event.id,
      name: event.name,
      alias: event.alias,
    });

    await scopeView.save();
  }
}
