import { AirForceSchemaInterface } from '../AirForceSoldier';
import { SoldierWrapper } from './SoldierWrapper';

export class AirForceSoldierWrapper implements SoldierWrapper {
  constructor(private soldier: AirForceSchemaInterface) {}

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
    return '';
  }
  getImageURL(): string {
    return this.soldier.image;
  }
}
