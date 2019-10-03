import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';

import { ScopeWasRemoved } from '../../../domain/event';
import { ScopeView } from '../schema/ScopeSchema';

@EventsHandler(ScopeWasRemoved)
export class ScopeWasRemovedProjection
  implements IEventHandler<ScopeWasRemoved> {
  constructor(
    @Inject('SCOPE_MODEL') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRemoved) {
    const scopeView = await this.scopeModel.findById(event.id).exec();

    scopeView.remove();
  }
}
