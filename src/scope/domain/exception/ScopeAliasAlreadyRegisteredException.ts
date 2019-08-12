export class ScopeAliasAlreadyRegisteredException extends Error {
  public static withString(
    scopeAlias: string,
  ): ScopeAliasAlreadyRegisteredException {
    return new ScopeAliasAlreadyRegisteredException(
      `ScopeAlias ${scopeAlias} already taken.`,
    );
  }
}
