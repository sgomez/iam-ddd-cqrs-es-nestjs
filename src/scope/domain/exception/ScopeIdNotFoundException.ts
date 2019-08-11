import { ScopeId } from '../model/ScopeId';

export class ScopeIdNotFoundException extends Error {
  public static withScopeId(scopeId: ScopeId): ScopeIdNotFoundException {
    return new ScopeIdNotFoundException(`ScopeId ${scopeId.value} not found.`);
  }
}
