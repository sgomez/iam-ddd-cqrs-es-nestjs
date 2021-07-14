import { GetScopeHandler } from './get-scope.handler';
import { GetScopesHandler } from './get-scopes.handler';

export const QueryHandlers = [GetScopeHandler, GetScopesHandler];

export * from './get-scope.query';
export * from './get-scopes.query';
