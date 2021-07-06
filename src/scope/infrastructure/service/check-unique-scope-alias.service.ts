import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { ScopeAlias, ScopeId } from '../../domain/model';
import { CheckUniqueScopeAlias } from '../../domain/services/check-unique-scope-alias.service';
import { SCOPE_MODEL, ScopeView } from '../read-model/schema/scope.schema';

@Injectable()
export class CheckUniqueScopeAliasFromReadModel
  implements CheckUniqueScopeAlias
{
  constructor(
    @Inject(SCOPE_MODEL) private readonly scopeModel: Model<ScopeView>,
  ) {}

  async with(alias: ScopeAlias): Promise<ScopeId> {
    const scopeView = await this.scopeModel.findOne({ alias: alias.value });

    if (scopeView === null) {
      return null;
    }

    return ScopeId.fromString(scopeView.id);
  }
}
