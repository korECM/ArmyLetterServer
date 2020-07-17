import mongoose, { Schema } from 'mongoose';
import { SportsSchemaInterface } from './Sports';

export interface ArmySoldierSchemaInterface extends mongoose.Document {
  name: string;
  birthDate: string;
  enterDate: string;
  armyUnit: string;
  trainUnitEdNm: string;
  endDate: string;
  sports: SportsSchemaInterface | null;
  registerDate: Date;
}

export let ArmySoldierSchema = new Schema({
  name: String,
  birthDate: String,
  enterDate: String,
  armyUnit: String,
  trainUnitEdNm: String,
  endDate: String,
  sports: { type: mongoose.Schema.Types.ObjectId, ref: 'Sports' },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const ArmySoldier = mongoose.model<ArmySoldierSchemaInterface>('ArmySoldier', ArmySoldierSchema);
export default ArmySoldier;
