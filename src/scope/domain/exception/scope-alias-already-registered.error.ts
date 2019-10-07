export class ScopeAliasAlreadyRegisteredError extends Error {
  public static withString(
    scopeAlias: string,
  ): ScopeAliasAlreadyRegisteredError {
    return new ScopeAliasAlreadyRegisteredError(
      `ScopeAlias ${scopeAlias} already taken.`,
    );
  }
}
