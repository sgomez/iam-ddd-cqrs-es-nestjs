import { ScopeWasCreated } from './scope-was-created.event';
import { ScopeWasRemoved } from './scope-was-removed.event';
import { ScopeWasRenamed } from './scope-was-renamed.event';

export { ScopeWasCreated, ScopeWasRemoved, ScopeWasRenamed };

export const DomainEvents = [ScopeWasCreated, ScopeWasRemoved, ScopeWasRenamed];
