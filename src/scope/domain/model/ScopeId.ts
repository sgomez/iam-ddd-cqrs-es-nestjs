import { ValueObject } from '../../../core/ddd';
import { version } from 'uuid-validate';

interface Props {
  value: string;
}

export class ScopeId extends ValueObject<Props> {
  public static fromString(id: string): ScopeId {
    if (version(id) !== 4) {
      throw new Error('Invalid Id');
    }

    return new ScopeId({ value: id });
  }

  public value(): string {
    return this.props.value;
  }
}
