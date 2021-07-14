import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { RemoveScopeDto } from '../../dto';

export class ScopeWasRemoved extends Event<RemoveScopeDto> {
  constructor(public readonly id: string) {
    super(id, { _id: id });
  }
}
