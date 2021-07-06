import { Event } from '@aulasoftwarelibre/nestjs-eventstore';

import { CreateScopeDto } from '../../application/dto/request/create-scope.dto';

export class ScopeWasCreated extends Event<CreateScopeDto> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly alias: string,
  ) {
    super({ id, name, alias });
  }
}
