import { ArmySoldierSchemaInterface, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface, AirForceSchemaColumnsInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, AirForceSoldier, ArmySoldierInterface, AirForceSoldierInterface, ArmyLetter, AirForceLetter } from '../../module/MIL/Models';
import { LetterSchemaInterface } from '../../models/Letter';

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

export abstract class AbstractSoldierService {
  abstract async getDBSoldierById(id: string, populate?: string): Promise<SoldierSimpleDBModel | null>;

  abstract async getMILSoldierByDBSoldier(soldier: SoldierSimpleDBModel | string): Promise<SoldierMILModel | null>;

  abstract async createDBSoldier(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<SoldierDBModel | null>;

  abstract async checkMILSoldierExistInSiteByDBSoldier(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<boolean>;

  abstract async sendLetter(soldier: string | SoldierSimpleDBModel, letter: MILLetterInterface): Promise<boolean>;

  abstract async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean>;

  abstract async saveLetter(options: any, letter: LetterSchemaInterface): Promise<number>;
}
