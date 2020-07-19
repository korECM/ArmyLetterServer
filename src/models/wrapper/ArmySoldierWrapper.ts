import { ArmySoldierSchemaInterface } from '../ArmySoldier';
import { SoldierWrapper } from './SoldierWrapper';

export class ArmySoldierWrapper implements SoldierWrapper {
  constructor(private soldier: ArmySoldierSchemaInterface) {}

  getName(): string {
    return this.soldier.name;
  }
  getBirthDate(): string {
    return this.soldier.birthDate;
  }
  getEnterDate(): string {
    return this.soldier.enterDate;
  }
  getEndDate(): string {
    return this.soldier.endDate;
  }
  getArmyUnit(): string {
    return this.soldier.armyUnit;
  }
  getImageURL(): string {
    return '';
  }
}
