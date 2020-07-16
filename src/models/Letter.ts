import mongoose, { Schema } from 'mongoose';
import { ArmySoldierSchemaInterface } from './ArmySoldier';
import { AirForceSchemaInterface } from './AirForceSoldier';

export interface LetterSchemaInterface extends mongoose.Document {
  title: string;
  body: string;
  airForceSoldier: AirForceSchemaInterface | null;
  armySoldier: ArmySoldierSchemaInterface | null;
  registerDate: Date;
}

export let LetterSchema = new Schema({
  title: String,
  body: String,
  airForceSoldier: { type: mongoose.Schema.Types.ObjectId, ref: 'AirForceSoldier' },
  armySoldier: { type: mongoose.Schema.Types.ObjectId, ref: 'ArmySoldier' },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const Letter = mongoose.model<LetterSchemaInterface>('Letter', LetterSchema);
export default Letter;
