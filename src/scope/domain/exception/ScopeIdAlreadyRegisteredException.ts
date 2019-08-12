export class ScopeIdAlreadyRegisteredException extends Error {
  public static withString(scopeId: string): ScopeIdAlreadyRegisteredException {
    return new ScopeIdAlreadyRegisteredException(
      `ScopeId ${scopeId} already taken.`,
    );
  }
}
