import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { EventStoreModule } from '../../../core/eventstore/eventstore.module';
import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { RenameScopeCommand } from './RenameScopeCommand';
import { RenameScopeHandler } from './RenameScopeHandler';

describe('RenameScopeHandler', () => {
  let eventPublisher$: EventPublisher;
  let eventStore$: ScopeEventStore;
  let command: RenameScopeHandler;

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

    command = new RenameScopeHandler(eventStore$, eventPublisher$);
  });

  it('should rename a scope', async () => {
    const newName = ScopeName.fromString('New name');
    eventStore$.find = jest.fn(id =>
      Promise.resolve(Scope.add(scopeId, name, alias)),
    );

    await command.execute(new RenameScopeCommand(scopeId, newName));

    const scope = Scope.add(scopeId, name, alias);
    scope.rename(newName);

    expect(eventStore$.save).toHaveBeenCalledTimes(1);
    expect(eventStore$.save).toHaveBeenCalledWith(scope);
  });

  it('should throw an error if scope does not exists', async () => {
    const newName = ScopeName.fromString('New name');
    eventStore$.find = jest.fn(x => null);

    expect(
      command.execute(new RenameScopeCommand(scopeId, newName)),
    ).rejects.toThrow(ScopeIdNotFoundException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });
});
