import { ValueObject } from '../../../core/ddd/ValueObject';

interface Props {
  value: string;
}

export class ScopeName extends ValueObject<Props> {
  public static fromString(name: string): ScopeName {
    if (name.length === 0) {
      throw new Error('Invalid name');
    }

    return new ScopeName({ value: name });
  }

  get value(): string {
    return this.props.value;
  }
}
