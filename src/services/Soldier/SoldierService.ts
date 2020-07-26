import { AirForceSoldierService } from './AirForceSolderService';
import { ArmySoldierService } from './ArmySoldierService';
import { MyError } from '../../types';

export class SoldierService {
  constructor() {}

  static getSoldierController(soldierType: String) {
    if (soldierType === 'army') {
      return new ArmySoldierService();
    } else if (soldierType === 'airForce') {
      return new AirForceSoldierService();
    } else {
      throw new MyError(400);
    }
  }
}
