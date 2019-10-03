import { Connection } from 'mongoose';

import { SCOPES } from './domain/repository';
import { ScopeEventStore } from './infrastructure/eventstore/ScopesEventStore';
import {
  SCOPE_MODEL,
  ScopeSchema,
} from './infrastructure/read-model/schema/ScopeSchema';

export const ScopeProviders = [
  {
    provide: SCOPE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Scope', ScopeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: SCOPES,
    useClass: ScopeEventStore,
  },
];
