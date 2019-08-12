import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasRemoved } from '../../../domain/event';
import { ScopeView } from '../schema/ScopeSchema';

@EventsHandler(ScopeWasRemoved)
export class ScopeWasRemovedProjection
  implements IEventHandler<ScopeWasRemoved> {
  constructor(
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRemoved) {
    const scopeView = await this.scopeModel.findById(event.id).exec();

    scopeView.remove();
  }
}
