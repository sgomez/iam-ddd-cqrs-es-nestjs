import { ScopeAlias, ScopeId } from '../model';

export interface CheckUniqueScopeAlias {
  with(alias: ScopeAlias): Promise<ScopeId>;
}

export const CHECK_UNIQUE_SCOPE_ALIAS = 'CHECK_UNIQUE_SCOPE_ALIAS';
