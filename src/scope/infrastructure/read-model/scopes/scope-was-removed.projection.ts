import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeWasRemoved } from '../../../domain/event';
import { ScopeDocument, SCOPES_PROJECTION } from './scope.schema';

@EventsHandler(ScopeWasRemoved)
export class ScopeWasRemovedProjection
  implements IEventHandler<ScopeWasRemoved>
{
  public get scopeModel(): Model<ScopeDocument> {
    return this._scopeModel;
  }
  constructor(
    @InjectModel(SCOPES_PROJECTION)
    private readonly _scopeModel: Model<ScopeDocument>,
  ) {}

  async handle(event: ScopeWasRemoved) {
    const scopeView = await this.scopeModel.findById(event.id).exec();

    await scopeView.remove();
  }
}
