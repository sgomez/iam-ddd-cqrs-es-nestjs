import { Inject } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";

import { ScopeIdNotFoundException } from "../../domain/exception/ScopeIdNotFoundException";
import { ScopeId, ScopeName } from "../../domain/model";
import { SCOPES } from "../../domain/repository";
import { ScopeEventStore } from "../../infrastructure/eventstore/ScopesEventStore";
import { SCOPE_MODEL, ScopeView } from "../../infrastructure/read-model/schema/ScopeSchema";
import { RenameScopeCommand } from "../command";

@CommandHandler(RenameScopeCommand)
export class RenameScopeHandler implements ICommandHandler<RenameScopeCommand> {
  constructor(
    @Inject(SCOPES) private readonly eventStore: ScopeEventStore,
    @Inject(SCOPE_MODEL) private readonly scopeModel: Model<ScopeView>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RenameScopeCommand) {
    const scopeView = await this.scopeModel.findById(command.scopeId);

    if (scopeView === null) {
      throw ScopeIdNotFoundException.withString(command.scopeId);
    }

    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);

    const scope = this.publisher.mergeObjectContext(
      await this.eventStore.find(scopeId),
    );
    scope.rename(name);

    this.eventStore.save(scope);
  }
}
