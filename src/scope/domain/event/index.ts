import { ScopeWasCreated } from './ScopeWasCreated';
import { ScopeWasRemoved } from './ScopeWasRemoved';
import { ScopeWasRenamed } from './ScopeWasRenamed';

export { ScopeWasCreated, ScopeWasRenamed, ScopeWasRemoved };

export const scopeEventHandlers = {
  ScopeWasCreated: (id: string, name: string, alias: string) =>
    new ScopeWasCreated(id, name, alias),
  ScopeWasRenamed: (id: string, name: string) => new ScopeWasRenamed(id, name),
  ScopeWasRemoved: (id: string) => new ScopeWasRemoved(id),
};
