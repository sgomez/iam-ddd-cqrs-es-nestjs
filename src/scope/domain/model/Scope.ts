import { AggregateRoot } from '@nestjs/cqrs';

import { ScopeWasCreated, ScopeWasRemoved, ScopeWasRenamed } from '../event';
import { ScopeAlias } from './ScopeAlias';
import { ScopeId } from './ScopeId';
import { ScopeName } from './ScopeName';

export class Scope extends AggregateRoot {
  private _scopeId: ScopeId;
  private _name: ScopeName;
  private _alias: ScopeAlias;
  private _isRemoved: boolean;

  constructor() {
    super();
  }

  public static add(
    scopeId: ScopeId,
    name: ScopeName,
    alias: ScopeAlias,
  ): Scope {
    const scope = new Scope();

    scope.apply(new ScopeWasCreated(scopeId, name, alias));

    return scope;
  }

  get id(): ScopeId {
    return this._scopeId;
  }

  get name(): ScopeName {
    return this._name;
  }

  get alias(): ScopeAlias {
    return this._alias;
  }

  get isRemoved(): boolean {
    return this._isRemoved;
  }

  rename(name: ScopeName) {
    if (name.equals(this._name)) {
      return;
    }

    this.apply(new ScopeWasRenamed(this._scopeId, name));
  }

  remove() {
    if (this._isRemoved) {
      return;
    }

    this.apply(new ScopeWasRemoved(this._scopeId));
  }

  private onScopeWasCreated(event: ScopeWasCreated) {
    this._scopeId = event.scopeId;
    this._name = event.name;
    this._alias = event.alias;
    this._isRemoved = false;
  }

  private onScopeWasRenamed(event: ScopeWasRenamed) {
    this._name = event.name;
  }

  private onScopeWasRemoved(event: ScopeWasRemoved) {
    this._isRemoved = true;
  }
}
