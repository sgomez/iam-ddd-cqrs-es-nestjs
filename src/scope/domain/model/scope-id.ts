import { v4 as uuid } from 'uuid';

import { Id } from '../../../common/domain/models/id';

export class ScopeId extends Id {
  static generate(): ScopeId {
    return new ScopeId(uuid());
  }

  public static fromString(id: string): ScopeId {
    return new ScopeId(id);
  }
}
