import { ICommand } from '@nestjs/cqrs';

export class RemoveScopeCommand implements ICommand {
  constructor(public readonly scopeId: string) {}
}
