import { MyError } from '../../types';
import { ArmySoldierService } from './ArmySoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, AirForceSoldier, ArmySoldierInterface, AirForceSoldierInterface, ArmyLetter, AirForceLetter } from '../../module/MIL/Models';

export type SoldierSimpleDBModel = ArmySoldierSchemaColumnsInterface | AirForceSchemaInterface;

export type SoldierDBModel = ArmySoldierSchemaInterface | AirForceSchemaInterface;

export type SoldierMILModel = ArmySoldierMIL | AirForceSoldier;

export type MILLetterModel = ArmyLetter | AirForceLetter;

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

  abstract async sendLetter(soldier: string | SoldierSimpleDBModel, letter: MILLetterModel): Promise<boolean>;
}
