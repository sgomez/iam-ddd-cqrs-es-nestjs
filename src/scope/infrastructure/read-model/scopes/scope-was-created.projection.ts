import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasCreated } from '../../../domain/event';
import { ScopeDocument, SCOPES_PROJECTION } from './scope.schema';

@EventsHandler(ScopeWasCreated)
export class ScopeWasCreatedProjection
  implements IEventHandler<ScopeWasCreated>
{
  constructor(
    @InjectModel(SCOPES_PROJECTION)
    private readonly scopes: Model<ScopeDocument>,
  ) {}

  async handle(event: ScopeWasCreated) {
    const scope = new this.scopes({ ...event.payload });

    await scope.save();
  }
}
