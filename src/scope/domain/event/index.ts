import { ScopeWasCreated } from './scope-was-created.event';
import { ScopeWasRemoved } from './scope-was-removed.event';
import { ScopeWasRenamed } from './scope-was-renamed.event';

export { ScopeWasCreated, ScopeWasRenamed, ScopeWasRemoved };

export const scopeEventHandlers = {
  ScopeWasCreated: (id: string, name: string, alias: string) =>
    new ScopeWasCreated(id, name, alias),
  ScopeWasRenamed: (id: string, name: string) => new ScopeWasRenamed(id, name),
  ScopeWasRemoved: (id: string) => new ScopeWasRemoved(id),
};
