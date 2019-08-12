import { v4 as uuid } from 'uuid';
import { version } from 'uuid-validate';

import { ValueObject } from '../../../core/ddd/ValueObject';

interface Props {
  value: string;
}

export class ScopeId extends ValueObject<Props> {
  static generate(): ScopeId {
    return new ScopeId({ value: uuid() });
  }

  public static fromString(id: string): ScopeId {
    if (version(id) !== 4) {
      throw new Error('Invalid Id');
    }

    return new ScopeId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
