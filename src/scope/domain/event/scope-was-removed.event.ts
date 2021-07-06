import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { RemoveScopeDto } from '../../application/dto/request/remove-scope.dto';

export class ScopeWasRemoved extends Event<RemoveScopeDto> {
  constructor(public readonly id: string) {
    super({ id });
  }
}
