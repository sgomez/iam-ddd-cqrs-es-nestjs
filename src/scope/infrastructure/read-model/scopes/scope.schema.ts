import { Document, Schema } from 'mongoose';

import { ScopeDto } from '../../../dto';

export const SCOPES_PROJECTION = 'scopes';

export type ScopeDocument = ScopeDto & Document;

export const ScopeSchema = new Schema(
  {
    _id: String,
    name: String,
    alias: String,
  },
  {
    versionKey: false,
  },
);
