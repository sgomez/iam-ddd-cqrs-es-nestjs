import { ScopeId } from '../../domain';
import { ScopeDto } from '../../dto';

export const SCOPE_FINDER = 'SCOPE_FINDER';

export interface IScopeFinder {
  findAll(): Promise<ScopeDto[]>;
  find(id: ScopeId): Promise<ScopeDto>;
}
