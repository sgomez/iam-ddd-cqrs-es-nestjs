import { IEvent } from '@nestjs/cqrs';
import { ScopeId } from '../model/ScopeId';
import { ScopeName } from '../model/ScopeName';
import { ScopeAlias } from '../model/ScopeAlias';

export class ScopeWasCreated implements IEvent {
  constructor(
    public readonly id: ScopeId,
    public readonly name: ScopeName,
    public readonly alias: ScopeAlias,
  ) {}
}
