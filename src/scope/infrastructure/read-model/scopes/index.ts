import { ScopeWasCreatedProjection } from './scope-was-created.projection';
import { ScopeWasRemovedProjection } from './scope-was-removed.projection';
import { ScopeWasRenamedProjection } from './scope-was-renamed.projection';

export * from './scope.schema';
export const ProjectionHandlers = [
  ScopeWasCreatedProjection,
  ScopeWasRenamedProjection,
  ScopeWasRemovedProjection,
];
