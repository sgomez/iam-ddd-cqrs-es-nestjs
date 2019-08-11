import { Scope } from '../model/Scope';
import { ScopeId } from '../model/ScopeId';

export interface Scopes {
  get(scopeId: ScopeId): Promise<Scope>;
  find(scopeId: ScopeId): Promise<Scope> | null;
  save(scope: Scope): void;
  nextIdentity(): ScopeId;
}
