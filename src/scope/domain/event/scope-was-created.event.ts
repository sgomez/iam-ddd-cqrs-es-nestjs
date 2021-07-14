import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { CreateScopeDto } from '../../dto';

export class ScopeWasCreated extends Event<CreateScopeDto> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly alias: string,
  ) {
    super(id, { _id: id, name, alias });
  }
}
