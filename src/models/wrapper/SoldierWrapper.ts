import { AirForceSchemaInterface } from '../AirForceSoldier';
import { ArmySoldierSchemaInterface } from '../ArmySoldier';
import { AirForceSoldierWrapper } from './AirForceSoldierWrapper';
import { ArmySoldierWrapper } from './ArmySoldierWrapper';

export function wrapSoldier(soldier: AirForceSchemaInterface | ArmySoldierSchemaInterface): SoldierWrapper {
  if ((soldier as AirForceSchemaInterface).image) {
    return new AirForceSoldierWrapper(soldier as AirForceSchemaInterface);
  } else {
    return new ArmySoldierWrapper(soldier as ArmySoldierSchemaInterface);
  }
}

export interface SoldierWrapper {
  getName(): string;
  getBirthDate(): string;
  getEnterDate(): string;
  getEndDate(): string;
  getArmyUnit(): string;
  getImageURL(): string;
}
