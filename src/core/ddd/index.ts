import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other: ValueObject<T>): boolean {
    if (typeof this !== typeof other) {
      return false;
    }

    return shallowEqual(this.props, other.props);
  }
}
