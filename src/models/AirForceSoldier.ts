import mongoose, { Schema } from 'mongoose';
import { SportsSchemaInterface } from './Sports';

export interface AirForceSchemaInterface extends mongoose.Document {
  name: string;
  birthDate: string;
  enterDate: string;
  image: string;
  trainUnitEdNm: string;
  endDate: string;
  sports: SportsSchemaInterface | null;
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
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const AirForceSoldier = mongoose.model<AirForceSchemaInterface>('AirForceSoldier', AirForceSchema);
export default AirForceSoldier;
