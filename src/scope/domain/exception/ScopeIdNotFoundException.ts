import { ScopeId } from '../model/ScopeId';

export class ScopeIdNotFoundException extends Error {
  public static withScopeId(scopeId: ScopeId): ScopeIdNotFoundException {
    return new ScopeIdNotFoundException(`ScopeId ${scopeId.value} not found.`);
  }

  public static withString(scopeId: string): ScopeIdNotFoundException {
    return new ScopeIdNotFoundException(`ScopeId ${scopeId} not found.`);
  }
}
