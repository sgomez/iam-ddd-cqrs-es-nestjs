import { Document, Schema } from 'mongoose';

export const ScopeSchema = new Schema({
  _id: String,
  name: String,
  alias: String,
  __v: { type: Number, select: false },
});

export interface ScopeView extends Document {
  readonly _id: string;
  readonly name: string;
  readonly alias: string;
}

export const SCOPE_MODEL = 'SCOPE_MODEL';
