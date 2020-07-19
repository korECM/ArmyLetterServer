import mongoose, { Schema } from 'mongoose';
import { SportsSchemaInterface } from './Sports';
import { LetterSchemaInterface } from './Letter';

export interface AirForceSchemaInterface extends mongoose.Document {
  name: string;
  birthDate: string;
  enterDate: string;
  image: string;
  trainUnitEdNm: string;
  endDate: string;
  sports: SportsSchemaInterface | null;
  letters: LetterSchemaInterface[] | string[];
  news: string[];
  corona: boolean;
  registerDate: Date;
}

export let AirForceSchema = new Schema({
  name: String,
  birthDate: String,
  enterDate: String,
  image: String,
  trainUnitEdNm: String,
  endDate: String,
  sports: { type: mongoose.Schema.Types.ObjectId, ref: 'Sports' },
  corona: { type: Boolean, default: false },
  news: { type: [String], default: [] },
  letters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Letter' }],
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const AirForceSoldier = mongoose.model<AirForceSchemaInterface>('AirForceSoldier', AirForceSchema);
export default AirForceSoldier;
