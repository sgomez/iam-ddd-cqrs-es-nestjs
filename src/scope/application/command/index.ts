import { CreateScopeHandler } from './create-scope.handler';
import { RemoveScopeHandler } from './remove-scope.handler';
import { RenameScopeHandler } from './rename-scope.handler';

export const CommandHandlers = [
  CreateScopeHandler,
  RenameScopeHandler,
  RemoveScopeHandler,
];

export * from './create-scope.command';
export * from './remove-scope.command';
export * from './rename-scope.command';
