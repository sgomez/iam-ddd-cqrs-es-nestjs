export class ScopeIdNotFoundException extends Error {
  public static withString(scopeId: string): ScopeIdNotFoundException {
    return new ScopeIdNotFoundException(`ScopeId ${scopeId} not found.`);
  }
}
