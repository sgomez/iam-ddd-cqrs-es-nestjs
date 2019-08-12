import { ScopeWasCreatedProjection } from './ScopeWasCreatedProjection';
import { ScopeWasRemovedProjection } from './ScopeWasRemovedProjection';
import { ScopeWasRenamedProjection } from './ScopeWasRenamedProjection';

export const ProjectionHandlers = [
  ScopeWasCreatedProjection,
  ScopeWasRenamedProjection,
  ScopeWasRemovedProjection,
];
