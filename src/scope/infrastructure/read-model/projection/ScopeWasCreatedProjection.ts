import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasCreated } from '../../../domain/event';
import { ScopeView } from '../schema/ScopeSchema';

@EventsHandler(ScopeWasCreated)
export class ScopeWasCreatedProjection
  implements IEventHandler<ScopeWasCreated> {
  constructor(
    @InjectModel('Scope') private readonly scopeModel: Model<ScopeView>,
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
