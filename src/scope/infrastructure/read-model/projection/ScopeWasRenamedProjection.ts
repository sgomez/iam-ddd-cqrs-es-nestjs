import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasRenamed } from '../../../domain/event';
import { ScopeView } from '../schema/ScopeSchema';

@EventsHandler(ScopeWasRenamed)
export class ScopeWasRenamedProjection
  implements IEventHandler<ScopeWasRenamed> {
  constructor(
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
  ) {}

  async handle(event: ScopeWasRenamed) {
    this.scopeModel.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}
