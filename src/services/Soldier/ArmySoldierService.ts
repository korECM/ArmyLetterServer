import { SoldierService } from './SoldierService';
import { ArmySoldierSchemaInterface, ArmySoldierDBInterface, ArmySoldierDB, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, ArmySoldierInterface, ArmyUnitTypeName } from '../../module/MIL/Models';
import { SoldierDBModel, SoldierMILModel } from './SoldierService';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';

export class ArmySoldierService extends SoldierService {
  constructor(private ArmySoldierDBModel: ArmySoldierDBInterface = new ArmySoldierDB()) {
    super();
  }

  async getSoldier(id: string): Promise<ArmySoldierSchemaColumnsInterface | null> {
    try {
      return await this.ArmySoldierDBModel.findByID(id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createSoldier(soldier: ArmySoldierInterface) {
    let armySoldier = await this.getSoldierFromSite(
      this.convertArmySoldierSchemaToArmySoldierMIL(null, soldier.name, soldier.armyUnit, soldier.birthDate, soldier.enterDate)!,
    );
    if (armySoldier) {
      await this.ArmySoldierDBModel.create({
        ...armySoldier,
        letters: [],
        armyUnit: armySoldier.trainUnitCdName!,
        trainUnitEdNm: armySoldier.trainUnitEdNm!,
        endDate: armySoldier.endDate!,
      });
      return armySoldier;
    } else {
      return null;
    }
  }

  private async getSoldierFromSite(soldier: ArmySoldierMIL) {
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

  async checkSoldierExistInSite(soldier: ArmySoldierSchemaColumnsInterface): Promise<boolean> {
    return (await this.getSoldierFromSite(this.convertArmySoldierSchemaToArmySoldierMIL(soldier)!)) !== null;
  }

  async findSoldierFromSite(soldier: ArmySoldierSchemaColumnsInterface | string): Promise<ArmySoldierMIL | null> {
    let soldierModel: ArmySoldierSchemaColumnsInterface | null = null;
    if (typeof soldier === 'string') {
      soldierModel = await this.getSoldier(soldier);
    } else {
      soldierModel = soldier;
    }

    if (soldierModel === null) return null;

    return this.getSoldierFromSite(this.convertArmySoldierSchemaToArmySoldierMIL(soldierModel)!);
  }

  private convertArmySoldierSchemaToArmySoldierMIL(
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
}
