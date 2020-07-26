import mongoose, { Schema } from 'mongoose';
import Sports, { SportsSchemaInterface } from './Sports';
import { LetterSchemaInterface } from './Letter';
import { SubscriptionRequestInterface } from '../services/Soldier/AbstractSoldierService';

export interface AirForceSchemaColumnsInterface {
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

export interface AirForceSchemaInterface extends mongoose.Document, AirForceSchemaColumnsInterface {}

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

interface AirForceSoldierDBCreateInterface {
  name: string;
  birthDate: string;
  enterDate: string;
  trainUnitEdNm: string;
  endDate: string;
  image: string;
  letters: string[];
}

export interface AirForceSoldierDBInterface {
  findByID(id: string, populate?: string): Promise<AirForceSchemaColumnsInterface>;
  create(data: AirForceSoldierDBCreateInterface): Promise<AirForceSchemaInterface>;
  saveSubscription(id: string, subscription: SubscriptionRequestInterface): Promise<boolean>;
  findSoldiers(option: any, populate?: string | undefined): Promise<AirForceSchemaInterface[]>;
  saveLetter(soldier: AirForceSchemaInterface, letter: LetterSchemaInterface): Promise<void>;
  findSoldier(name: string, birthDate: string): Promise<AirForceSchemaColumnsInterface>;
}

export class AirForceSoldierDB {
  constructor() {}

  async findSoldier(name: string, birthDate: string) {
    return (await AirForceSoldier.findOne({ name, birthDate }).exec()) as AirForceSchemaColumnsInterface;
  }

  async findByID(id: string, populate?: string) {
    if (populate !== undefined) return (await AirForceSoldier.findOne({ _id: id }).populate(populate).exec()) as AirForceSchemaColumnsInterface;
    return (await AirForceSoldier.findOne({ _id: id }).exec()) as AirForceSchemaColumnsInterface;
  }

  async create(data: AirForceSoldierDBCreateInterface) {
    let soldier = new AirForceSoldier(data);
    await soldier.save();
    return soldier;
  }

  async findSoldiers(option: any, populate?: string) {
    if (populate) {
      return await AirForceSoldier.find(option).populate(populate);
    }
    return await AirForceSoldier.find(option);
  }

  async saveLetter(soldier: AirForceSchemaInterface, letter: LetterSchemaInterface) {
    if (!soldier.letters) soldier.letters = [];
    soldier.letters.push(letter._id);
    await soldier.save();
  }

  async saveSubscription(id: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    let soldier = (await this.findByID(id, 'sports')) as AirForceSchemaInterface;
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

    const { corona } = subscription;

    soldier.corona = corona;

    await soldier.save();

    return true;
  }
}
