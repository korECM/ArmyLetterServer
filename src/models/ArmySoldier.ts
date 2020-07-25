import mongoose, { Schema } from 'mongoose';
import Sports, { SportsSchemaInterface } from './Sports';
import { LetterSchemaInterface } from './Letter';
import { ArmyUnitTypeName } from '../module/MIL/Models/Army';
import { SubscriptionRequestInterface } from '../services/Soldier/SoldierService';

export interface ArmySoldierSchemaColumnsInterface {
  name: string;
  birthDate: string;
  enterDate: string;
  armyUnit: ArmyUnitTypeName;
  trainUnitEdNm: string;
  endDate: string;
  sports: SportsSchemaInterface | null;
  news: string[];
  letters: LetterSchemaInterface[] | string[];
  corona: boolean;
  registerDate: Date;
}

export interface ArmySoldierSchemaInterface extends mongoose.Document, ArmySoldierSchemaColumnsInterface {}

export let ArmySoldierSchema = new Schema({
  name: String,
  birthDate: String,
  enterDate: String,
  armyUnit: String,
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

const ArmySoldier = mongoose.model<ArmySoldierSchemaInterface>('ArmySoldier', ArmySoldierSchema);
export default ArmySoldier;

export interface ArmySoldierDBInterface {
  findByID(id: string): Promise<ArmySoldierSchemaColumnsInterface | null>;
  create(data: ArmySoldierDBCreateInterface): Promise<ArmySoldierSchemaInterface>;
  saveSubscription(id: string, subscription: SubscriptionRequestInterface): Promise<boolean>;
}

interface ArmySoldierDBCreateInterface {
  name: string;
  birthDate: string;
  enterDate: string;
  armyUnit: string;
  trainUnitEdNm: string;
  endDate: string;
  letters: string[];
}
export class ArmySoldierDB implements ArmySoldierDBInterface {
  constructor() {}

  async findByID(id: string) {
    return (await ArmySoldier.findOne({ _id: id }).exec()) as ArmySoldierSchemaColumnsInterface;
  }

  async create(data: ArmySoldierDBCreateInterface) {
    let soldier = new ArmySoldier(data);
    await soldier.save();
    return soldier;
  }

  async saveSubscription(id: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    let soldier = (await this.findByID(id)) as ArmySoldierSchemaInterface;
    if (!soldier) return false;

    let sports: SportsSchemaInterface | null;

    // undefined or null
    if (!soldier.sports) {
      sports = new Sports();
      soldier.sports = sports._id;
    } else {
      sports = soldier.sports;
    }

    const { koreaBaseball, koreaBasketball, koreaSoccer, worldBaseball, worldBasketball, worldSoccer, esports } = subscription.sports;

    sports.koreaBaseball = koreaBaseball;
    sports.koreaBasketball = koreaBasketball;
    sports.koreaSoccer = koreaSoccer;
    sports.worldBaseball = worldBaseball;
    sports.worldBasketball = worldBasketball;
    sports.worldSoccer = worldSoccer;
    sports.esports = esports;

    await sports.save();

    const { news } = subscription;

    soldier.news = news;

    // TODO: 코로나 추가

    await soldier.save();

    return true;
  }
}
