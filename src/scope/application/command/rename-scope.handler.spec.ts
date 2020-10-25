import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import {
  ScopeIdNotFoundError,
} from '../../domain/exception/scope-id-not-found.error';
import { Scope, ScopeAlias, ScopeId, ScopeName } from '../../domain/model';
import { SCOPES, Scopes } from '../../domain/repository';
import { RenameScopeCommand } from './rename-scope.command';
import { RenameScopeHandler } from './rename-scope.handler';

describe('RenameScopeHandler', () => {
  let command$: RenameScopeHandler;

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  const scopes: Partial<Scopes> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenameScopeHandler,
        {
          provide: SCOPES,
          useValue: scopes,
        },
      ],
    }).compile();

    command$ = module.get<RenameScopeHandler>(RenameScopeHandler);
    scopes.find = jest.fn().mockResolvedValue(null);
    scopes.save = jest.fn();
  });

  it('should rename a scope', async () => {
    const scope = Scope.add(scopeId, name, alias);
    const newName = ScopeName.fromString('New name');

    scopes.find = jest.fn().mockResolvedValue(scope);
    scope.rename(newName);

    await command$.execute(
      new RenameScopeCommand(scopeId.value, newName.value),
    );

    expect(scopes.save).toHaveBeenCalledTimes(1);
    expect(scopes.save).toHaveBeenCalledWith(scope);
  });

  it('should throw an error if scope does not exists', async () => {
    expect(
      command$.execute(new RenameScopeCommand(scopeId.value, 'New name')),
    ).rejects.toThrow(ScopeIdNotFoundError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if scope is removed', async () => {
    const scope = Scope.add(scopeId, name, alias);

    scopes.find = jest.fn().mockResolvedValue(scope);
    scope.remove();

    expect(
      command$.execute(new RenameScopeCommand(scopeId.value, 'New name')),
    ).rejects.toThrow(ScopeIdNotFoundError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });
});
