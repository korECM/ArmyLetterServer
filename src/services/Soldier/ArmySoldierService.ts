import { ArmySoldierSchemaInterface, ArmySoldierDBInterface, ArmySoldierDB, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierMIL, ArmySoldierInterface, ArmyUnitTypeName, ArmyLetter } from '../../module/MIL/Models';
import { SoldierSimpleDBModel, SoldierMILModel, MILLetterInterface, SubscriptionRequestInterface, AbstractSoldierService } from './AbstractSoldierService';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';
import { isValidObjectId } from 'mongoose';
import { IMilitaryLetter } from '../../module/MIL/Service/IMilitaryLetter';

export class ArmySoldierService extends AbstractSoldierService {
  constructor(private ArmySoldierDBModel: ArmySoldierDBInterface = new ArmySoldierDB(), private militaryLetter: IMilitaryLetter = new MilitaryLetter()) {
    super();
  }
  /**
   * 모델 id가 적절한지 검사하는 함수
   *
   * @private
   * @param {string} id
   * @returns {boolean}
   * @memberof ArmySoldierService
   */
  private checkIdValid(id: string): boolean {
    return !!id && id.length > 0 && isValidObjectId(id);
  }

  /**
   * DBId 또는 군인 모델을 전달받았을 때 군인 모델을 반환해준다
   *
   * @private
   * @param {(ArmySoldierSchemaColumnsInterface | string)} soldier
   * @returns
   * @memberof ArmySoldierService
   */
  private async getDBSoldierBetweenModelAndId(soldier: ArmySoldierSchemaColumnsInterface | string) {
    if (typeof soldier === 'string') {
      return await this.getDBSoldierById(soldier);
    } else {
      return soldier;
    }
  }
  /**
   * DBId를 전달받으면 군인 모델을 반환해준다
   *
   * @param {string} id
   * @returns {(Promise<ArmySoldierSchemaColumnsInterface | null>)}
   * @memberof ArmySoldierService
   */
  async getDBSoldierById(id: string, populate?: string): Promise<ArmySoldierSchemaColumnsInterface | null> {
    if (this.checkIdValid(id) === false) return null;

    try {
      return await this.ArmySoldierDBModel.findByID(id, populate);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  /**
   * DBModel을 생성해서 저장
   *
   * @param {ArmySoldierInterface} soldier
   * @returns
   * @memberof ArmySoldierService
   */
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
  /**
   * MIL에 로그인 하고 해당 모듈 반환
   *
   * @private
   * @param {string} [id]
   * @param {string} [pw]
   * @returns
   * @memberof ArmySoldierService
   */
  private async loginMIL(id?: string, pw?: string) {
    const ml = this.militaryLetter;
    if (id && id.length && pw && pw?.length) {
      await ml.config(id, pw);
    } else {
      await ml.config(process.env.ID!, process.env.PW!);
    }
    return ml;
  }
  /**
   * MIL 모듈에 해당 군인을 요청하고 군인을 가져온다
   *
   * @private
   * @param {ArmySoldierMIL} soldier
   * @param {string} [id]
   * @param {string} [pw]
   * @returns
   * @memberof ArmySoldierService
   */
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
  /**
   * MIL 모듈로부터 해당 군인이 존재하는 지를 확인한다
   *
   * @param {ArmySoldierSchemaColumnsInterface} soldier
   * @returns {Promise<boolean>}
   * @memberof ArmySoldierService
   */
  async checkMILSoldierExistInSiteByDBSoldier(soldier: ArmySoldierSchemaColumnsInterface): Promise<boolean> {
    return (await this.getMILSoldierFromSite(this.convertDBSoldierToMILSoldier(soldier)!)) !== null;
  }
  /**
   * DB 모델 또는 id로부터 MIL 모델을 가져온다
   *
   * @param {(ArmySoldierSchemaColumnsInterface | string)} soldier
   * @returns {(Promise<ArmySoldierMIL | null>)}
   * @memberof ArmySoldierService
   */
  async getMILSoldierByDBSoldier(soldier: ArmySoldierSchemaColumnsInterface | string): Promise<ArmySoldierMIL | null> {
    return this.convertDBSoldierToMILSoldier(await this.getDBSoldierBetweenModelAndId(soldier));
  }
  /**
   * DB 모델을 MIL 모델로 변환
   *
   * @private
   * @param {(ArmySoldierSchemaColumnsInterface | null)} soldierModel
   * @returns
   * @memberof ArmySoldierService
   */
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
  /**
   * MIL 모델을 만들어주는 팩토리
   *
   * @private
   * @param {string} name
   * @param {ArmyUnitTypeName} armyUnit
   * @param {string} birthDate
   * @param {string} enterDate
   * @returns
   * @memberof ArmySoldierService
   */
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
  /**
   * 주어진 DB 군인에게 편지를 작성하는 함수
   *
   * @param {(string | ArmySoldierSchemaColumnsInterface)} soldier
   * @param {MILLetterInterface} letter
   * @param {string} [id]
   * @param {string} [pw]
   * @returns {Promise<boolean>}
   * @memberof ArmySoldierService
   */
  async sendLetter(soldier: string | ArmySoldierSchemaColumnsInterface, letter: MILLetterInterface, id?: string, pw?: string): Promise<boolean> {
    try {
      let soldierModel: ArmySoldierMIL | null = await this.getMILSoldierByDBSoldier(soldier);

      if (!soldierModel) return false;

      let ml = await this.loginMIL(id, pw);

      await ml.setSoldier(soldierModel);

      if (!letter.senderName || letter.senderName.length === 0 || (await ml.updateNickname(letter.senderName)) === false) {
        await ml.updateNickname('인편 대행 서비스');
      }

      await ml.sendLetter(new ArmyLetter(letter.title, letter.body));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  /**
   * DB 군인의 구독 정보 업데이트 하는 함수
   *
   * @param {string} soldier
   * @param {SubscriptionRequestInterface} subscription
   * @returns {Promise<boolean>}
   * @memberof ArmySoldierService
   */
  async updateSubscription(soldier: string, subscription: SubscriptionRequestInterface): Promise<boolean> {
    if (this.checkIdValid(soldier) === false) return false;
    return await this.ArmySoldierDBModel.saveSubscription(soldier, subscription);
  }
}
