import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ScopeId } from '../../domain';
import { ScopeDto } from '../../dto';
import { IScopeFinder, SCOPE_FINDER } from '../services';
import { GetScopeQuery } from './get-scope.query';

@QueryHandler(GetScopeQuery)
export class GetScopeHandler implements IQueryHandler {
  constructor(@Inject(SCOPE_FINDER) private readonly finder: IScopeFinder) {}

  async execute(query: GetScopeQuery): Promise<ScopeDto> {
    const scopeId = ScopeId.fromString(query.id);

    return this.finder.find(scopeId);
  }
}
