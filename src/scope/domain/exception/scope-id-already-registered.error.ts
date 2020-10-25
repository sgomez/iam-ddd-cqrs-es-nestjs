export class ScopeIdAlreadyRegisteredError extends Error {
  public static withString(scopeId: string): ScopeIdAlreadyRegisteredError {
    return new ScopeIdAlreadyRegisteredError(
      `ScopeId ${scopeId} already taken.`,
    );
  }
}
