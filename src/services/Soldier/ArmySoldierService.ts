import { SoldierService } from './SoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierDBInterface, ArmySoldierDB, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, ArmySoldierInterface, ArmyUnitTypeName, ArmyLetter } from '../../module/MIL/Models';
import { SoldierSimpleDBModel, SoldierMILModel } from './SoldierService';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';

export class ArmySoldierService extends SoldierService {
  constructor(private ArmySoldierDBModel: ArmySoldierDBInterface = new ArmySoldierDB()) {
    super();
  }

  async getDBSoldierById(id: string): Promise<ArmySoldierSchemaColumnsInterface | null> {
    try {
      return await this.ArmySoldierDBModel.findByID(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createDBSoldier(soldier: ArmySoldierInterface) {
    let armySoldier = await this.getMILSoldierFromSite(
      this.convertDBSoldierToMILSoldier(null, soldier.name, soldier.armyUnit, soldier.birthDate, soldier.enterDate)!,
    );
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

  private async getMILSoldierFromSite(soldier: ArmySoldierMIL) {
    let ml = new MilitaryLetter();
    try {
      await ml.config(process.env.ID!, process.env.PW!);

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
    let soldierModel: ArmySoldierSchemaColumnsInterface | null = null;
    if (typeof soldier === 'string') {
      soldierModel = await this.getDBSoldierById(soldier);
    } else {
      soldierModel = soldier;
    }

    if (soldierModel === null) return null;

    return this.convertDBSoldierToMILSoldier(soldierModel);
  }

  private convertDBSoldierToMILSoldier(
    soldierModel: ArmySoldierSchemaColumnsInterface | null,
    name?: string,
    armyUnit?: ArmyUnitTypeName,
    birthDate?: string,
    enterDate?: string,
  ) {
    if (soldierModel) {
      return new ArmySoldierMIL({
        armyType: '육군',
        relationship: '친구/지인',
        soldierType: '예비군인/훈련병',
        armyUnit: soldierModel.armyUnit,
        birthDate: soldierModel.birthDate,
        enterDate: soldierModel.enterDate,
        name: soldierModel.name,
      });
    } else if (name && armyUnit && birthDate && enterDate) {
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
    return null;
  }

  async sendLetter(soldier: string | ArmySoldierSchemaColumnsInterface, letter: ArmyLetter, id?: string, pw?: string): Promise<boolean> {
    try {
      let soldierModel: ArmySoldierMIL | null = null;
      if (typeof soldier === 'string') {
        soldierModel = this.convertDBSoldierToMILSoldier(await this.getDBSoldierById(soldier));
      } else {
        soldierModel = await this.getMILSoldierByDBSoldier(soldier);
      }

      if (!soldierModel) return false;

      const ml = new MilitaryLetter();
      if (id && id.length && pw && pw?.length) {
        await ml.config(id, pw);
      } else {
        await ml.config(process.env.ID!, process.env.PW!);
      }

      await ml.setSoldier(soldierModel);

      await ml.sendLetter(letter);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
