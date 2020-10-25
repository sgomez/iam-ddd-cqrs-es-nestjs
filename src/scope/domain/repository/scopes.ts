import { Scope, ScopeId } from '../model';

export interface Scopes {
  find(scopeId: ScopeId): Promise<Scope> | null;
  get(scopeId: ScopeId): Promise<Scope>;
  nextIdentity(): ScopeId;
  save(scope: Scope): void;
}
