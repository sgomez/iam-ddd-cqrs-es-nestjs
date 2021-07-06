import { Scope, ScopeId } from '../model';

export interface Scopes {
  find(scopeId: ScopeId): Promise<Scope> | null;
  save(scope: Scope): void;
}
