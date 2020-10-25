import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/common/database';

import { SCOPES } from '../domain/repository';
import { CHECK_UNIQUE_SCOPE_ALIAS } from '../domain/services/check-unique-scope-alias.service';
import { ScopeEventStore } from './eventstore';
import { SCOPE_MODEL, ScopeSchema } from './read-model/schema/scope.schema';
import { CheckUniqueScopeAliasFromReadModel } from './service/check-unique-scope-alias.service';

export const ScopeProviders = [
  {
    provide: SCOPE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Scope', ScopeSchema),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: SCOPES,
    useClass: ScopeEventStore,
  },
  {
    provide: CHECK_UNIQUE_SCOPE_ALIAS,
    useClass: CheckUniqueScopeAliasFromReadModel,
  },
];
