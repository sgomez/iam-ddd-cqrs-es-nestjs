import { v4 as uuid } from 'uuid';
import { version } from 'uuid-validate';

import { Id } from '../../../core/domain/models/id';

interface Props {
  value: string;
}

export class ScopeId extends Id {
  static generate(): ScopeId {
    return new ScopeId(uuid());
  }

  public static fromString(id: string): ScopeId {
    if (version(id) !== 4) {
      throw new Error('Invalid Id');
    }

    return new ScopeId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
