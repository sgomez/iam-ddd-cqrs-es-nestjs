import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { RenameScopeDto } from '../../dto';

export class ScopeWasRenamed extends Event<RenameScopeDto> {
  constructor(public readonly id: string, public readonly name: string) {
    super(id, { _id: id, name });
  }
}
