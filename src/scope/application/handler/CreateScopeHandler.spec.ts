import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { BootstrapModule } from '../../../bootstrap.module';
import { EventStoreModule } from '../../../core/eventstore/eventstore.module';
import { ScopeIdAlreadyRegisteredException } from '../../domain/exception';
import { ScopeAliasAlreadyRegisteredException } from '../../domain/exception/ScopeAliasAlreadyRegisteredException';
import { Scope } from '../../domain/model/Scope';
import { ScopeAlias } from '../../domain/model/ScopeAlias';
import { ScopeId } from '../../domain/model/ScopeId';
import { ScopeName } from '../../domain/model/ScopeName';
import { SCOPES } from '../../domain/repository';
import { ScopeEventStore } from '../../infrastructure/eventstore/ScopesEventStore';
import { SCOPE_MODEL } from '../../infrastructure/read-model/schema/ScopeSchema';
import { CreateScopeCommand } from '../command/CreateScopeCommand';
import { CreateScopeHandler } from './CreateScopeHandler';

describe('CreateScopeHandler', () => {
  let eventPublisher$: EventPublisher;
  let eventStore$: ScopeEventStore;
  let command$: CreateScopeHandler;

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  const scopeView = {
    _id: scopeId.value,
    name: name.value,
    alias: alias.value,
  };

  const scopeModel = {
    findOne: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, EventStoreModule.forFeature(), BootstrapModule],
      providers: [
        CreateScopeHandler,
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
    eventStore$.find = jest.fn().mockResolvedValue(null);
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
    eventPublisher$.mergeObjectContext = jest.fn(x => x);
    command$ = module.get<CreateScopeHandler>(CreateScopeHandler);
  });

  it('should creates a new scope', async () => {
    await command$.execute(
      new CreateScopeCommand(scopeId.value, name.value, alias.value),
    );

    expect(eventStore$.save).toHaveBeenCalledTimes(1);
    expect(eventStore$.save).toHaveBeenCalledWith(
      Scope.add(scopeId, name, alias),
    );
  });

  it('should not creates an existing scope alias', async () => {
    scopeModel.findOne = jest.fn().mockResolvedValue(scopeView);

    expect(
      command$.execute(
        new CreateScopeCommand(scopeId.value, name.value, alias.value),
      ),
    ).rejects.toThrow(ScopeAliasAlreadyRegisteredException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });

  it('should not creates an existing scope id', async () => {
    eventStore$.find = jest
      .fn()
      .mockResolvedValue(Scope.add(scopeId, name, alias));

    expect(
      command$.execute(
        new CreateScopeCommand(scopeId.value, name.value, alias.value),
      ),
    ).rejects.toThrow(ScopeIdAlreadyRegisteredException);

    expect(eventStore$.save).toHaveBeenCalledTimes(0);
  });
});
