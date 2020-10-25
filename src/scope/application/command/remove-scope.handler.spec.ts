import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import {
  ScopeIdNotFoundError,
} from '../../domain/exception/scope-id-not-found.error';
import { Scope, ScopeAlias, ScopeId, ScopeName } from '../../domain/model';
import { SCOPES, Scopes } from '../../domain/repository';
import { RemoveScopeCommand } from './remove-scope.command';
import { RemoveScopeHandler } from './remove-scope.handler';

describe('RemoveScopeHandler', () => {
  let command$: RemoveScopeHandler;

  const scopes: Partial<Scopes> = {};

  const scopeId = ScopeId.fromString(uuid());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveScopeHandler,
        {
          provide: SCOPES,
          useValue: scopes,
        },
      ],
    }).compile();

    command$ = module.get<RemoveScopeHandler>(RemoveScopeHandler);
    scopes.find = jest.fn().mockResolvedValue(null);
    scopes.save = jest.fn();
  });

  it('should remove a scope', async () => {
    const scope = Scope.add(scopeId, name, alias);
    scopes.find = jest.fn().mockResolvedValue(scope);

    await command$.execute(new RemoveScopeCommand(scopeId.value));

    expect(scopes.save).toHaveBeenCalledTimes(1);
    expect(scopes.save).toHaveBeenCalledWith(scope);
  });

  it('should throw an error if scope does not exists', async () => {
    scopes.find = jest.fn().mockResolvedValue(null);

    expect(
      command$.execute(new RemoveScopeCommand(scopeId.value)),
    ).rejects.toThrow(ScopeIdNotFoundError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if scope was removed', async () => {
    const scope = Scope.add(scopeId, name, alias);
    scope.remove();
    scopes.find = jest.fn().mockResolvedValue(scope);

    expect(
      command$.execute(new RemoveScopeCommand(scopeId.value)),
    ).rejects.toThrow(ScopeIdNotFoundError);

    expect(scopes.save).toHaveBeenCalledTimes(0);
  });
});
