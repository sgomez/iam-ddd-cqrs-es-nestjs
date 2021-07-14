import { SCOPE_FINDER } from '../application';
import { CHECK_UNIQUE_SCOPE_ALIAS } from '../domain/services/check-unique-scope-alias.service';
import { ScopeFinder } from './service';
import { CheckUniqueScopeAliasFromReadModel } from './service/check-unique-scope-alias.service';

export const ScopeProviders = [
  {
    provide: CHECK_UNIQUE_SCOPE_ALIAS,
    useClass: CheckUniqueScopeAliasFromReadModel,
  },
  {
    provide: SCOPE_FINDER,
    useClass: ScopeFinder,
  },
];
