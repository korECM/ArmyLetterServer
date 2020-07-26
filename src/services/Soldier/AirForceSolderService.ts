import { SubscriptionRequestInterface, AbstractSoldierService } from './AbstractSoldierService';
import { AirForceSoldierDBInterface, AirForceSoldierDB, AirForceSchemaColumnsInterface, AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { IMilitaryLetter } from '../../module/MIL/Service/IMilitaryLetter';
import { MilitaryLetter, AirForceSoldier } from '../../module/MIL/Service/MilitaryLetter';
import { AirForceSoldierInterface, AirForceLetter } from '../../module/MIL/Models';
import { isValidObjectId } from 'mongoose';

export class AirForceSoldierService extends AbstractSoldierService {
  constructor(
    private AirForceSoldierDBModel: AirForceSoldierDBInterface = new AirForceSoldierDB(),
    private militaryLetter: IMilitaryLetter = new MilitaryLetter(),
  ) {
    super();
  }

  /**
   * 모델 id가 적절한지 검사하는 함수
   *
   * @private
   * @param {string} id
   * @returns {boolean}
   * @memberof AirForceSoldierService
   */
  private checkIdValid(id: string): boolean {
    return !!id && id.length > 0 && isValidObjectId(id);
  }

  async getDBSoldierById(id: string): Promise<AirForceSchemaColumnsInterface | null> {
    if (this.checkIdValid(id) === false) return null;
    return await this.AirForceSoldierDBModel.findByID(id);
  }

  /**
   * DBId 또는 군인 모델을 전달받았을 때 군인 모델을 반환해준다
   *
   * @private
   * @param {(AirForceSchemaColumnsInterface | string)} soldier
   * @returns
   * @memberof AirForceSoldierService
   */
  private async getDBSoldierBetweenModelAndId(soldier: AirForceSchemaColumnsInterface | string) {
    if (typeof soldier === 'string') {
      return await this.getDBSoldierById(soldier);
    } else {
      return soldier;
    }
  }

  async getMILSoldierByDBSoldier(soldier: AirForceSchemaColumnsInterface | string): Promise<AirForceSoldier | null> {
    let dbSoldier = await this.getDBSoldierBetweenModelAndId(soldier);
    if (dbSoldier === null) return null;

    return this.convertDBSoldierToMILSoldier(dbSoldier);
  }

  /**
   * MIL 모듈에 해당 군인을 요청하고 군인을 가져온다
   *
   * @private
   * @param {AirForceSoldier} soldier
   * @param {string} [id]
   * @param {string} [pw]
   * @returns
   * @memberof AirForceSoldierService
   */
  private async getMILSoldierFromSite(soldier: AirForceSoldier, id?: string, pw?: string) {
    try {
      let ml = this.militaryLetter;

      await ml.setSoldier(soldier);

      return ml.getSoldier() as AirForceSoldier;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private createMILSoldier(soldier: AirForceSoldierInterface) {
    return new AirForceSoldier({
      birthDate: soldier.birthDate.replace(/-/g, ''),
      name: soldier.name,
      endDate: soldier.endDate,
      enterDate: soldier.enterDate,
      imageURL: soldier.imageURL,
      soldierInfo: soldier.soldierInfo,
      traineeNum: soldier.traineeNum,
    });
  }

  /**
   * DB 모델을 MIL 모델로 변환
   *
   * @private
   * @param {(AirForceSchemaColumnsInterface | null)} soldierModel
   * @returns
   * @memberof AirForceSoldierService
   */
  private convertDBSoldierToMILSoldier(soldierModel: AirForceSchemaColumnsInterface | null) {
    if (soldierModel === null) return null;
    return new AirForceSoldier({
      birthDate: soldierModel.birthDate.replace(/-/g, ''),
      name: soldierModel.name,
      endDate: soldierModel.endDate,
      enterDate: soldierModel.enterDate,
      imageURL: soldierModel.image,
      soldierInfo: soldierModel.trainUnitEdNm,
      traineeNum: '',
    });
  }

  async createDBSoldier(soldier: AirForceSoldierInterface): Promise<AirForceSchemaInterface | null> {
    let milSoldier = await this.getMILSoldierFromSite(this.createMILSoldier(soldier));
    if (milSoldier === null) return null;

    // TODO: birthDate가 -형태로 넘어오는지 확인 필요
    return await this.AirForceSoldierDBModel.create({
      birthDate: milSoldier.birthDate,
      endDate: milSoldier.endDate!,
      enterDate: milSoldier.enterDate!,
      image: milSoldier.imageURL!,
      letters: [],
      name: milSoldier.name,
      trainUnitEdNm: milSoldier.traineeNum!,
    });
  }

  async checkMILSoldierExistInSiteByDBSoldier(soldier: AirForceSoldierInterface): Promise<boolean> {
    return (await this.getMILSoldierFromSite(soldier)) !== null;
  }

  async sendLetter(soldier: AirForceSchemaColumnsInterface | string, letter: AirForceLetter): Promise<boolean> {
    return true;
  }

  async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    if (this.checkIdValid(soldier) === false) return false;
    return await this.AirForceSoldierDBModel.saveSubscription(soldier, subscription);
  }
}
