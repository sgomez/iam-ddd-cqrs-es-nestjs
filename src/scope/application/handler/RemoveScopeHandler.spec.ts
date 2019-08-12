import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { EventStoreModule } from '../../../core/eventstore/eventstore.module';
import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { RemoveScopeCommand } from '../command/RemoveScopeCommand';
import { RemoveScopeHandler } from './RemoveScopeHandler';

describe('RemoveScopeHandler', () => {
  let eventPublisher$: EventPublisher;
  let eventStore$: ScopeEventStore;
  let command$: RemoveScopeHandler;

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  const scopeView = {
    _id: scopeId.value,
    name: name.value,
    alias: alias.value,
  };

  const eventModel = {
    findById: jest.fn().mockResolvedValue(scopeView),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, EventStoreModule.forFeature()],
      providers: [
        RemoveScopeHandler,
        ScopeEventStore,
        {
          provide: getModelToken('Scope'),
          useValue: eventModel,
        },
      ],
    }).compile();

    eventStore$ = module.get<ScopeEventStore>(ScopeEventStore);
    eventStore$.save = jest.fn();
    eventStore$.find = jest
      .fn()
      .mockResolvedValue(Scope.add(scopeId, name, alias));
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
    eventPublisher$.mergeObjectContext = jest.fn(x => x);
    command$ = module.get<RemoveScopeHandler>(RemoveScopeHandler);
  });

  it('should remove a scope', async () => {
    const scope = Scope.add(scopeId, name, alias);
    scope.remove();

    await command$.execute(new RemoveScopeCommand(scopeId.value));

    expect(eventStore$.save).toHaveBeenCalledTimes(1);
    expect(eventStore$.save).toHaveBeenCalledWith(scope);
  });

  it('should throw an error if scope does not exists', async () => {
    eventModel.findById = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveScopeCommand(scopeId.value)),
    ).rejects.toThrow(ScopeIdNotFoundException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });
});
