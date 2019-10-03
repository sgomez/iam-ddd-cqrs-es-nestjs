import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { BootstrapModule } from '../../../bootstrap.module';
import { EventStoreModule } from '../../../core/eventstore/eventstore.module';
import { ScopeIdNotFoundException } from '../../domain/exception/ScopeIdNotFoundException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { SCOPES } from '../../domain/repository';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { SCOPE_MODEL } from '../../infrastructure/read-model/schema/ScopeSchema';
import { RenameScopeCommand } from '../command/RenameScopeCommand';
import { RenameScopeHandler } from './RenameScopeHandler';

describe('RenameScopeHandler', () => {
  let eventPublisher$: EventPublisher;
  let eventStore$: ScopeEventStore;
  let command$: RenameScopeHandler;

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  const scopeView = {
    _id: scopeId.value,
    name: name.value,
    alias: alias.value,
  };

  const scopeModel = {
    findById: jest.fn().mockResolvedValue(scopeView),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, EventStoreModule.forFeature(), BootstrapModule],
      providers: [
        RenameScopeHandler,
        {
          provide: SCOPE_MODEL,
          useValue: scopeModel,
        },
        {
          provide: SCOPES,
          useClass: ScopeEventStore,
        },
      ],
    }).compile();

    eventStore$ = module.get<ScopeEventStore>(SCOPES);
    eventStore$.save = jest.fn();
    eventStore$.find = jest
      .fn()
      .mockResolvedValue(Scope.add(scopeId, name, alias));
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
    eventPublisher$.mergeObjectContext = jest.fn(x => x);
    command$ = module.get<RenameScopeHandler>(RenameScopeHandler);
  });

  it('should rename a scope', async () => {
    const scope = Scope.add(scopeId, name, alias);
    const newName = ScopeName.fromString('New name');
    scope.rename(newName);

    await command$.execute(
      new RenameScopeCommand(scopeId.value, newName.value),
    );

    expect(eventStore$.save).toHaveBeenCalledTimes(1);
    expect(eventStore$.save).toHaveBeenCalledWith(scope);
  });

  it('should throw an error if scope does not exists', async () => {
    scopeModel.findById = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RenameScopeCommand(scopeId.value, 'New name')),
    ).rejects.toThrow(ScopeIdNotFoundException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });
});
