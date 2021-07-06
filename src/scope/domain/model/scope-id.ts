import { Id } from '@aulasoftwarelibre/nestjs-eventstore';
import { v4 as uuid } from 'uuid';

export class ScopeId extends Id {
  static generate(): ScopeId {
    return new ScopeId(uuid());
  }

  public static fromString(id: string): ScopeId {
    return new ScopeId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
