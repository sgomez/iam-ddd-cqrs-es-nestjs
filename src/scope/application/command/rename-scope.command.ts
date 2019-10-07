import { ICommand } from '@nestjs/cqrs';

export class RenameScopeCommand implements ICommand {
  constructor(public readonly scopeId: string, public readonly name: string) {}
}
