import { ValueObject } from '../../../common/domain/models/value-object';

interface Props {
  value: string;
}

export class ScopeAlias extends ValueObject<Props> {
  public static fromString(alias: string): ScopeAlias {
    if (!/^[a-z][a-z0-9\-]*$/.test(alias)) {
      throw new Error('Invalid alias');
    }

    return new ScopeAlias({ value: alias });
  }

  get value(): string {
    return this.props.value;
  }
}
