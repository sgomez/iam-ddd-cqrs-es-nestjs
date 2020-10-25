import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import {
  ScopeAliasAlreadyRegisteredError,
  ScopeIdAlreadyRegisteredError,
} from '../../domain/exception';
import { Scope, ScopeAlias, ScopeId, ScopeName } from '../../domain/model';
import { SCOPES, Scopes } from '../../domain/repository';
import {
  CHECK_UNIQUE_SCOPE_ALIAS,
  CheckUniqueScopeAlias,
} from '../../domain/services/check-unique-scope-alias.service';
import { CreateScopeCommand } from './create-scope.command';
import { CreateScopeHandler } from './create-scope.handler';

describe('CreateScopeHandler', () => {
  let command$: CreateScopeHandler;

  const scopes: Partial<Scopes> = {};
  const checkUniqueScopeAlias: Partial<CheckUniqueScopeAlias> = {};

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateScopeHandler,
        {
          provide: SCOPES,
          useValue: scopes,
        },
        {
          provide: CHECK_UNIQUE_SCOPE_ALIAS,
          useValue: checkUniqueScopeAlias,
        },
      ],
    }).compile();

    command$ = module.get<CreateScopeHandler>(CreateScopeHandler);
    scopes.find = jest.fn().mockResolvedValue(null);
    scopes.save = jest.fn();
    checkUniqueScopeAlias.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new scope', async () => {
    await command$.execute(
      new CreateScopeCommand(scopeId.value, name.value, alias.value),
    );

    expect(scopes.save).toHaveBeenCalledWith(Scope.add(scopeId, name, alias));
  });

  it('should not creates an existing scope alias', async () => {
    checkUniqueScopeAlias.with = jest.fn().mockResolvedValue(scopeId);

    expect(
      command$.execute(
        new CreateScopeCommand(scopeId.value, name.value, alias.value),
      ),
    ).rejects.toThrow(ScopeAliasAlreadyRegisteredError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });

  it('should not creates an existing scope id', async () => {
    scopes.find = jest.fn().mockResolvedValue(Scope.add(scopeId, name, alias));

    expect(
      command$.execute(
        new CreateScopeCommand(scopeId.value, name.value, alias.value),
      ),
    ).rejects.toThrow(ScopeIdAlreadyRegisteredError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });
});
