import { CreateScopeHandler } from './CreateScopeHandler';
import { RemoveScopeHandler } from './RemoveScopeHandler';
import { RenameScopeHandler } from './RenameScopeHandler';

export const CommandHandlers = [
  CreateScopeHandler,
  RenameScopeHandler,
  RemoveScopeHandler,
];
