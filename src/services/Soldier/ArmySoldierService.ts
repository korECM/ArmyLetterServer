import { SoldierService, MILLetterInterface, SubscriptionRequestInterface } from './SoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierDBInterface, ArmySoldierDB, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, ArmySoldierInterface, ArmyUnitTypeName, ArmyLetter } from '../../module/MIL/Models';
import { SoldierSimpleDBModel, SoldierMILModel } from './SoldierService';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';
import { isValidObjectId } from 'mongoose';

export class ArmySoldierService extends SoldierService {
  constructor(private ArmySoldierDBModel: ArmySoldierDBInterface = new ArmySoldierDB()) {
    super();
  }

  private async getDBSoldierBetweenModelAndId(soldier: ArmySoldierSchemaColumnsInterface | string) {
    if (typeof soldier === 'string') {
      return await this.getDBSoldierById(soldier);
    } else {
      return soldier;
    }
  }

  async getDBSoldierById(id: string): Promise<ArmySoldierSchemaColumnsInterface | null> {
    if (!id || !id.length || isValidObjectId(id) === false) return null;

    try {
      return await this.ArmySoldierDBModel.findByID(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createDBSoldier(soldier: ArmySoldierInterface) {
    let armySoldier = await this.getMILSoldierFromSite(this.createMILSoldier(soldier.name, soldier.armyUnit, soldier.birthDate, soldier.enterDate)!);
    if (armySoldier) {
      return await this.ArmySoldierDBModel.create({
        ...armySoldier,
        letters: [],
        armyUnit: armySoldier.trainUnitCdName!,
        trainUnitEdNm: armySoldier.trainUnitEdNm!,
        endDate: armySoldier.endDate!,
      });
    } else {
      return null;
    }
  }

  private async loginMIL(id?: string, pw?: string) {
    const ml = new MilitaryLetter();
    if (id && id.length && pw && pw?.length) {
      await ml.config(id, pw);
    } else {
      await ml.config(process.env.ID!, process.env.PW!);
    }
    return ml;
  }

  private async getMILSoldierFromSite(soldier: ArmySoldierMIL, id?: string, pw?: string) {
    try {
      let ml = await this.loginMIL(id, pw);

      await ml.setSoldier(soldier);

      return ml.getSoldier() as ArmySoldierMIL;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async checkMILSoldierExistInSiteByDBSoldier(soldier: ArmySoldierSchemaColumnsInterface): Promise<boolean> {
    return (await this.getMILSoldierFromSite(this.convertDBSoldierToMILSoldier(soldier)!)) !== null;
  }

  async getMILSoldierByDBSoldier(soldier: ArmySoldierSchemaColumnsInterface | string): Promise<ArmySoldierMIL | null> {
    let soldierModel: ArmySoldierSchemaColumnsInterface | null = await this.getDBSoldierBetweenModelAndId(soldier);

    if (soldierModel === null) return null;

    return this.convertDBSoldierToMILSoldier(soldierModel);
  }

  private convertDBSoldierToMILSoldier(soldierModel: ArmySoldierSchemaColumnsInterface | null) {
    if (soldierModel === null) return null;
    return new ArmySoldierMIL({
      armyType: '육군',
      relationship: '친구/지인',
      soldierType: '예비군인/훈련병',
      armyUnit: soldierModel.armyUnit,
      birthDate: soldierModel.birthDate,
      enterDate: soldierModel.enterDate,
      name: soldierModel.name,
    });
  }

  private createMILSoldier(name: string, armyUnit: ArmyUnitTypeName, birthDate: string, enterDate: string) {
    return new ArmySoldierMIL({
      armyType: '육군',
      relationship: '친구/지인',
      soldierType: '예비군인/훈련병',
      armyUnit: armyUnit,
      birthDate: birthDate,
      enterDate: enterDate,
      name: name,
    });
  }

  async sendLetter(soldier: string | ArmySoldierSchemaColumnsInterface, letter: MILLetterInterface, id?: string, pw?: string): Promise<boolean> {
    try {
      let soldierModel: ArmySoldierMIL | null = this.convertDBSoldierToMILSoldier(await this.getDBSoldierBetweenModelAndId(soldier));

      if (!soldierModel) return false;

      let ml = await this.loginMIL(id, pw);

      await ml.setSoldier(soldierModel);

      if ((await ml.updateNickname(letter.sender)) === false) {
        await ml.updateNickname('인편 대행 서비스');
      }

      await ml.sendLetter(new ArmyLetter(letter.title, letter.body));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    return await this.ArmySoldierDBModel.saveSubscription(soldier, subscription);
  }
}
