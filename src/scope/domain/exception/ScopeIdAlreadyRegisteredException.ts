import { ScopeId } from '../model/ScopeId';

export class ScopeIdAlreadyRegisteredException extends Error {
  public static withScopeId(
    scopeId: ScopeId,
  ): ScopeIdAlreadyRegisteredException {
    return new ScopeIdAlreadyRegisteredException(
      `ScopeId ${scopeId.value} already taken.`,
    );
  }
}
