import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { RenameScopeDto } from '../../infrastructure/dto';

export class ScopeWasRenamed extends Event<RenameScopeDto> {
  constructor(public readonly id: string, public readonly name: string) {
    super({ id, name });
  }
}
