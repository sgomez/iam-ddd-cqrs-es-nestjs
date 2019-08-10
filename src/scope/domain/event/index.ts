import { ScopeWasCreated } from './ScopeWasCreated';
import { ScopeWasRenamed } from './ScopeWasRenamed';
import { ScopeWasRemoved } from './ScopeWasRemoved';

export type ScopeEvent = ScopeWasCreated | ScopeWasRenamed | ScopeWasRemoved;

export { ScopeWasCreated, ScopeWasRenamed, ScopeWasRemoved };
