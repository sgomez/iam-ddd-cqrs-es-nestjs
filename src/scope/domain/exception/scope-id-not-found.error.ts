export class ScopeIdNotFoundError extends Error {
  public static withString(scopeId: string): ScopeIdNotFoundError {
    return new ScopeIdNotFoundError(`ScopeId ${scopeId} not found.`);
  }
}
