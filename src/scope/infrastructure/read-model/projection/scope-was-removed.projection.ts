import { Inject } from '@nestjs/common';
import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';
import { Model } from 'mongoose';

import { ScopeWasRemoved } from '../../../domain/event';
import { ScopeView } from '../schema/scope.schema';

@ViewUpdaterHandler(ScopeWasRemoved)
export class ScopeWasRemovedProjection
  implements IViewUpdater<ScopeWasRemoved> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRemoved) {
    const scopeView = await this.scopeModel.findById(event.id).exec();

    await scopeView.remove();
  }
}
