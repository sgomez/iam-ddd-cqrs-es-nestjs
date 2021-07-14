import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ScopeDto } from '../../dto';
import { IScopeFinder, SCOPE_FINDER } from '../services';
import { GetScopesQuery } from './get-scopes.query';

@QueryHandler(GetScopesQuery)
export class GetScopesHandler implements IQueryHandler {
  constructor(@Inject(SCOPE_FINDER) private readonly finder: IScopeFinder) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetScopesQuery): Promise<ScopeDto[]> {
    return this.finder.findAll();
  }
}
