import { Inject } from "@nestjs/common";
import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";

import { ScopeAliasAlreadyRegisteredException, ScopeIdAlreadyRegisteredException } from "../../domain/exception";
import { Scope, ScopeAlias, ScopeId, ScopeName } from "../../domain/model";
import { SCOPES } from "../../domain/repository";
import { ScopeEventStore } from "../../infrastructure/eventstore/ScopesEventStore";
import { SCOPE_MODEL, ScopeView } from "../../infrastructure/read-model/schema/ScopeSchema";
import { CreateScopeCommand } from "../command";

@CommandHandler(CreateScopeCommand)
export class CreateScopeHandler implements ICommandHandler<CreateScopeCommand> {
  constructor(
    @Inject(SCOPES) private readonly eventStore: ScopeEventStore,
    @Inject(SCOPE_MODEL) private readonly scopeModel: Model<ScopeView>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateScopeCommand) {
    const scopeId = ScopeId.fromString(command.scopeId);
    const name = ScopeName.fromString(command.name);
    const alias = ScopeAlias.fromString(command.alias);

    const instance = await this.eventStore.find(scopeId);

    if (instance instanceof Scope) {
      throw ScopeIdAlreadyRegisteredException.withString(command.scopeId);
    }

    const scopeView = await this.scopeModel.findOne({ alias: command.alias });
    if (scopeView !== null) {
      throw ScopeAliasAlreadyRegisteredException.withString(command.alias);
    }

    const scope = this.publisher.mergeObjectContext(
      Scope.add(scopeId, name, alias),
    );

    this.eventStore.save(scope);
  }
}
