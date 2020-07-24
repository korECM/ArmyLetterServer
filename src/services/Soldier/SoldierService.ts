import { MyError } from '../../types';
import { ArmySoldierService } from './ArmySoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, AirForceSoldier, ArmySoldierInterface, AirForceSoldierInterface } from '../../module/MIL/Models';

export type SoldierDBModel = ArmySoldierSchemaColumnsInterface | AirForceSchemaInterface;

export type SoldierMILModel = ArmySoldierMIL | AirForceSoldier;

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

  abstract async getSoldier(id: string): Promise<SoldierDBModel | null>;

  abstract async findSoldierFromSite(soldier: SoldierDBModel | string): Promise<SoldierMILModel | null>;

  abstract async createSoldier(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<SoldierMILModel | null>;

  abstract async checkSoldierExistInSite(soldier: ArmySoldierInterface | AirForceSoldierInterface): Promise<boolean>;
}
