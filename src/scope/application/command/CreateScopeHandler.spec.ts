import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { EventStoreModule } from '../../../core/eventstore/eventstore.module';
import { ScopeIdAlreadyRegisteredException } from '../../domain/exception/ScopeIdAlreadyRegisteredException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { CreateScopeCommand } from './CreateScopeCommand';
import { CreateScopeHandler } from './CreateScopeHandler';

describe('CreateScopeHandler', () => {
  let eventPublisher$: EventPublisher;
  let eventStore$: ScopeEventStore;
  let command: CreateScopeHandler;

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, EventStoreModule.forFeature()],
      providers: [ScopeEventStore],
    }).compile();

    eventStore$ = module.get<ScopeEventStore>(ScopeEventStore);
    eventStore$.save = jest.fn(x => null);
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
    eventPublisher$.mergeObjectContext = jest.fn(x => x);

    command = new CreateScopeHandler(eventStore$, eventPublisher$);
  });

  it('should creates a new scope', async () => {
    eventStore$.find = jest.fn(x => null);

    await command.execute(new CreateScopeCommand(scopeId, name, alias));

    expect(eventStore$.save).toHaveBeenCalledTimes(1);
    expect(eventStore$.save).toHaveBeenCalledWith(
      Scope.add(scopeId, name, alias),
    );
  });

  it('should not creates an existing scope id', async () => {
    eventStore$.find = jest.fn(id =>
      Promise.resolve(Scope.add(scopeId, name, alias)),
    );

    expect(
      command.execute(new CreateScopeCommand(scopeId, name, alias)),
    ).rejects.toThrow(ScopeIdAlreadyRegisteredException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });
});
