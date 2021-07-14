import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasRenamed } from '../../../domain/event';
import { ScopeDocument, SCOPES_PROJECTION } from './scope.schema';

@EventsHandler(ScopeWasRenamed)
export class ScopeWasRenamedProjection
  implements IEventHandler<ScopeWasRenamed>
{
  constructor(
    @InjectModel(SCOPES_PROJECTION)
    private readonly scopes: Model<ScopeDocument>,
  ) {}

  async handle(event: ScopeWasRenamed) {
    await this.scopes.updateOne({ _id: event.id }, { name: event.name }).exec();
  }
}
