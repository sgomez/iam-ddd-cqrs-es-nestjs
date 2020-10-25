import { Inject } from '@nestjs/common';
import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';
import { Model } from 'mongoose';

import { ScopeWasRenamed } from '../../../domain/event';
import { ScopeView } from '../schema/scope.schema';

@ViewUpdaterHandler(ScopeWasRenamed)
export class ScopeWasRenamedProjection
  implements IViewUpdater<ScopeWasRenamed> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRenamed) {
    await this.scopeModel
      .updateOne({ _id: event.id }, { name: event.name })
      .exec();
  }
}
