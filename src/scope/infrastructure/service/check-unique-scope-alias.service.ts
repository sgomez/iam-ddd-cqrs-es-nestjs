import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ScopeAlias, ScopeId } from '../../domain/model';
import { CheckUniqueScopeAlias } from '../../domain/services/check-unique-scope-alias.service';
import { ScopeDocument, SCOPES_PROJECTION } from '../read-model';

@Injectable()
export class CheckUniqueScopeAliasFromReadModel
  implements CheckUniqueScopeAlias
{
  constructor(
    @InjectModel(SCOPES_PROJECTION)
    private readonly scopes: Model<ScopeDocument>,
  ) {}

  async with(alias: ScopeAlias): Promise<ScopeId> {
    const scopeView = await this.scopes.findOne({ alias: alias.value });

    if (scopeView === null) {
      return null;
    }

    return ScopeId.fromString(scopeView.id);
  }
}
