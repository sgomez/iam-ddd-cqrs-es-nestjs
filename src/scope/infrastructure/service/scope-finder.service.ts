import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IScopeFinder } from '../../application';
import { ScopeId } from '../../domain';
import { ScopeDto } from '../../dto';
import { ScopeDocument, SCOPES_PROJECTION } from '../read-model';

@Injectable()
export class ScopeFinder implements IScopeFinder {
  constructor(
    @InjectModel(SCOPES_PROJECTION)
    private scopes: Model<ScopeDocument>,
  ) {}

  findAll(): Promise<ScopeDto[]> {
    return this.scopes.find().exec();
  }

  find(id: ScopeId): Promise<ScopeDto> {
    return this.scopes.findById(id.value).exec();
  }
}
