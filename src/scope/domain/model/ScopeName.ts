import { ValueObject } from '@app/core/ddd';

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

  public value(): string {
    return this.props.value;
  }
}
