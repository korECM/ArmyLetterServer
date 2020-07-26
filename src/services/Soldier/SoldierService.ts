import { MyError } from '../../types';
import { ArmySoldierService } from './ArmySoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface, AirForceSchemaColumnsInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, AirForceSoldier, ArmySoldierInterface, AirForceSoldierInterface, ArmyLetter, AirForceLetter } from '../../module/MIL/Models';

export type SoldierSimpleDBModel = ArmySoldierSchemaColumnsInterface | AirForceSchemaColumnsInterface;

export type SoldierDBModel = ArmySoldierSchemaInterface | AirForceSchemaInterface;

export type SoldierMILModel = ArmySoldierMIL | AirForceSoldier;

export type MILLetterModel = ArmyLetter | AirForceLetter;

export interface MILLetterInterface {
  title: string;
  body: string;
  senderName: string;
  relationship?: string;
  password?: string;
  zipCode?: string;
  addr1?: string;
  addr2?: string;
}

export interface SubscriptionRequestInterface {
  sports: {
    koreaBaseball: string[];
    koreaBasketball: string[];
    koreaSoccer: string[];
    worldBaseball: string[];
    worldBasketball: string[];
    worldSoccer: string[];
    esports: string[];
  };
  news: string[];
}

export abstract class SoldierService {
  constructor() {}

  static getSoldierController(soldierType: String) {
    if (soldierType === 'army') {
      return new ArmySoldierService();
    } else if (soldierType === 'airForce') {
    } else {
      throw new MyError(400);
    }
  }

  abstract async getDBSoldierById(id: string): Promise<SoldierSimpleDBModel | null>;

  abstract async getMILSoldierByDBSoldier(soldier: SoldierSimpleDBModel | string): Promise<SoldierMILModel | null>;

  abstract async createDBSoldier(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<SoldierDBModel | null>;

  abstract async checkMILSoldierExistInSiteByDBSoldier(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<boolean>;

  abstract async sendLetter(soldier: string | SoldierSimpleDBModel, letter: MILLetterInterface): Promise<boolean>;

  abstract async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean>;
}
