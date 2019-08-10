import { TestingModule, Test } from '@nestjs/testing';
import { Scope } from './Scope';
import { ScopeId } from './ScopeId';
import { v4 } from 'uuid';
import { ScopeName } from './ScopeName';
import { ScopeAlias } from './ScopeAlias';
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { ScopeWasCreated, ScopeWasRenamed, ScopeWasRemoved } from '../event';

describe('Scope', () => {
  let scope: Scope;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const scopeId = ScopeId.fromString(v4());
  const name = ScopeName.fromString('Scope Name');
  const alias = ScopeAlias.fromString('scope-alias');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    scope = eventPublisher$.mergeObjectContext(Scope.add(scopeId, name, alias));
    scope.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new ScopeWasCreated(scopeId, name, alias),
    );
  });

  it('has an id', () => {
    expect(scope.id.equals(scopeId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(scope.name.equals(name)).toBeTruthy();
  });

  it('has an alias', () => {
    expect(scope.alias.equals(alias)).toBeTruthy();
  });

  it('is not removed by default', () => {
    expect(scope.isRemoved).toBeFalsy();
  });

  it('can be renamed', () => {
    const newName = ScopeName.fromString('New name');
    scope = eventPublisher$.mergeObjectContext(scope);
    scope.rename(newName);
    scope.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new ScopeWasRenamed(scopeId, newName),
    );

    expect(scope.name.equals(newName)).toBeTruthy();
  });

  it('can be removed', () => {
    scope = eventPublisher$.mergeObjectContext(scope);
    scope.remove();
    scope.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new ScopeWasRemoved(scopeId),
    );

    expect(scope.isRemoved).toBeTruthy();
  });
});
