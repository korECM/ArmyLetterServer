import mongoose, { Schema } from 'mongoose';
import { ArmySoldierSchemaInterface } from './ArmySoldier';
import { AirForceSchemaInterface } from './AirForceSoldier';

export interface LetterSchemaInterface extends mongoose.Document {
  title: string;
  body: string;
  registerDate: Date;
  sended: boolean;
}

export let LetterSchema = new Schema({
  title: String,
  body: String,
  sended: { type: Boolean, default: false },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const Letter = mongoose.model<LetterSchemaInterface>('Letter', LetterSchema);
export default Letter;
