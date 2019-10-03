import { CreateScopeHandler } from './CreateScopeHandler';
import { RemoveScopeHandler } from './RemoveScopeHandler';
import { RenameScopeHandler } from './RenameScopeHandler';

export { CreateScopeHandler, RemoveScopeHandler, RenameScopeHandler };

export const CommandHandlers = [
  CreateScopeHandler,
  RenameScopeHandler,
  RemoveScopeHandler,
];
