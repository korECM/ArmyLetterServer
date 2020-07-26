import { SubscriptionRequestInterface, AbstractSoldierService } from './AbstractSoldierService';
import { AirForceSoldierDBInterface, AirForceSoldierDB, AirForceSchemaColumnsInterface, AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { IMilitaryLetter } from '../../module/MIL/Service/IMilitaryLetter';
import { MilitaryLetter, AirForceSoldier } from '../../module/MIL/Service/MilitaryLetter';
import { AirForceSoldierInterface, AirForceLetter } from '../../module/MIL/Models';

export class AirForceSoldierService extends AbstractSoldierService {
  constructor(
    private AirForceSoldierDBModel: AirForceSoldierDBInterface = new AirForceSoldierDB(),
    private militaryLetter: IMilitaryLetter = new MilitaryLetter(),
  ) {
    super();
  }

  async getDBSoldierById(id: string): Promise<AirForceSchemaColumnsInterface | null> {
    return null;
  }

  async getMILSoldierByDBSoldier(soldier: AirForceSchemaColumnsInterface | string): Promise<AirForceSoldier | null> {
    return null;
  }

  async createDBSoldier(soldier: AirForceSoldierInterface): Promise<AirForceSchemaInterface | null> {
    return null;
  }

  async checkMILSoldierExistInSiteByDBSoldier(soldier: AirForceSoldierInterface): Promise<boolean> {
    return true;
  }

  async sendLetter(soldier: AirForceSchemaColumnsInterface | string, letter: AirForceLetter): Promise<boolean> {
    return true;
  }

  async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    return true;
  }
}
