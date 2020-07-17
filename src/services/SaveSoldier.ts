import { AirForceSchemaInterface } from '../models/AirForceSoldier';
import { ArmySoldierSchemaInterface } from '../models/ArmySoldier';

export async function saveSoldier(soldier: AirForceSchemaInterface | ArmySoldierSchemaInterface, soldierType: string) {
  switch (soldierType) {
    case 'airForce':
      return await (soldier as AirForceSchemaInterface).save();
    case 'army':
      return await (soldier as ArmySoldierSchemaInterface).save();
    default:
      return null;
  }
}
