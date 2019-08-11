import { ScopeWasCreated } from './ScopeWasCreated';
import { ScopeWasRemoved } from './ScopeWasRemoved';
import { ScopeWasRenamed } from './ScopeWasRenamed';

export type ScopeEvent = ScopeWasCreated | ScopeWasRenamed | ScopeWasRemoved;

export { ScopeWasCreated, ScopeWasRenamed, ScopeWasRemoved };
