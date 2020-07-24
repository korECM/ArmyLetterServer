import { checkDate } from '../Utils';
export enum ArmySoldierType {
  '예비군인/훈련병' = '0000490001',
  '병사' = '0000490002',
  '장교' = '0000490003',
  '부사관' = '0000490004',
  '군무원' = '0000490005',
}
export type ArmySoldierTypeName = '예비군인/훈련병' | '병사' | '장교' | '부사관' | '군무원';
export enum ArmyType {
  '육군' = '0000010001',
  '해군' = '0000010002',
  '공군' = '0000010003',
  '해병대' = '0000010004',
}
export type ArmyTypeName = '육군' | '공군' | '해군' | '해병대';

export enum ArmyUnitType {
  '1사단' = '20121290100',
  '2사단' = '20121490100',
  '3사단' = '20121590100',
  '5사단' = '20121690200',
  '6사단' = '20121590200',
  '7사단' = '20121390100',
  '9사단' = '20121290200',
  '11사단' = '20121790300',
  '12사단' = '20121490200',
  '15사단' = '20121390200',
  '17사단' = '20121190100',
  '20사단' = '20121790400',
  '21사단' = '20121490300',
  '22사단' = '20121890100',
  '23사단' = '20121890200',
  '25사단' = '20121290300',
  '27사단' = '20121390300',
  '28사단' = '20121690100',
  '30사단' = '20121290400',
  '31사단' = '20220280100',
  '32사단' = '20220280200',
  '35사단' = '20220280300',
  '36사단' = '20120180100',
  '37사단' = '20220280400',
  '39사단' = '20220280500',
  '50사단' = '20220280600',
  '51사단' = '20121190200',
  '53사단' = '20220280700',
  '육군훈련소-논산' = '20020191700',
  '육군훈련소(23연대)' = '20020191800',
  '육군훈련소(25연대)' = '20020191900',
  '육군훈련소(26연대)' = '20020192000',
  '육군훈련소(27연대)' = '20020192100',
  '육군훈련소(28연대)' = '20020192200',
  '육군훈련소(29연대)' = '20020192300',
  '육군훈련소(30연대)' = '20020192400',
}
export type ArmyUnitTypeName =
  | '1사단'
  | '2사단'
  | '3사단'
  | '5사단'
  | '6사단'
  | '7사단'
  | '9사단'
  | '11사단'
  | '12사단'
  | '15사단'
  | '17사단'
  | '20사단'
  | '21사단'
  | '22사단'
  | '23사단'
  | '25사단'
  | '27사단'
  | '28사단'
  | '30사단'
  | '31사단'
  | '32사단'
  | '35사단'
  | '36사단'
  | '37사단'
  | '39사단'
  | '50사단'
  | '51사단'
  | '53사단'
  | '육군훈련소-논산'
  | '육군훈련소(23연대)'
  | '육군훈련소(25연대)'
  | '육군훈련소(26연대)'
  | '육군훈련소(27연대)'
  | '육군훈련소(28연대)'
  | '육군훈련소(29연대)'
  | '육군훈련소(30연대)';

export enum ArmyRelationship {
  '부모' = '0000420001', // 부모
  '배우자' = '0000420003', // 배우자
  '형제/자매' = '0000420002', // 형제/자매
  '친구/지인' = '0000420006', // 친구/지인
  '애인' = '0000420005', // 애인
  '친척' = '0000420004', // 친척
  '팬' = '0000420007', // 팬
}
export type ArmyRelationshipName = '부모' | '배우자' | '형제/자매' | '친구/지인' | '애인' | '친척' | '팬';

export interface ArmySoldierInterface {
  soldierType: ArmySoldierTypeName;
  armyType: ArmyTypeName;
  name: string;
  birthDate: string;
  enterDate: string;
  armyUnit: ArmyUnitTypeName;
  relationship: ArmyRelationshipName;
}

class ArmySoldier {
  /**
   * @property {ArmySoldierType} 훈련병인지, 장교인지 등등의 코드
   */
  public soldierType: ArmySoldierType;
  /**
   * @property {ArmySoldierTypeName} 훈련병인지, 장교인지 등등의 이름 ex) 예비군인/훈련병
   */
  public soldierTypeName: ArmySoldierTypeName;
  /**
   * @property {ArmyType} 해군인지 육군인지 코드
   */
  public grpCd: ArmyType;
  /**
   * @property {ArmyTypeName} 해군인지 육군인지 ex) 육군
   */
  public grpCdName: ArmyTypeName;
  public name: string;
  public birthDate: string;
  public enterDate: string;
  /**
   * @property {ArmyUnitType} 소속 코드 1시단 등등
   */
  public trainUnitCd: ArmyUnitType;
  /**
   * @property {ArmyUnitTypeName} 어느 사단 소속인지 ex) 1사단, 육군훈련소
   */
  public trainUnitCdName: ArmyUnitTypeName;
  /**
   * @property {ArmyRelationshipName} 훈련병과의 관계 ex) 부모, 배우자,형제/자매,친구/지인,애인,친척,팬
   */
  public relationShipName: ArmyRelationshipName;
  /**
   * @property {ArmyRelationship} 훈련병과의 관계 코드ex) 부모, 배우자,형제/자매,친구/지인,애인,친척,팬
   */
  public relationship: ArmyRelationship;
  /**
   * 군인을 구분하는 정보
   *
   * @type {number}
   * @memberof ArmySoldier
   */
  public traineeMgrSeq?: number;
  /**
   * @property {string} 어느 교육대 소속인지 ex) 2교육대 8중대
   */
  public trainUnitEdNm?: string;
  /**
   * @property {string} 수료일 ex) 2020.04.14
   */
  public endDate?: string;
  /**
   * @property {string} 교번
   */
  public traineeNum?: string;
  /**
   *Creates an instance of ArmySoldier.
   * @param {ArmySoldierTypeName} soldierType 훈련병인지, 장교인지 등등의 이름 ex) 예비군인/훈련병
   * @param {ArmyTypeName} armyType 해군인지 육군인지 ex) 육군
   * @param {string} name 훈련병의 이름
   * @param {string} birthDate 생일 ex) "1999-11-12",
   * @param {string} enterDate 입소일 ex) "2020-03-09"
   * @param {ArmyUnitTypeName} armyUnit  어느 사단 소속인지 ex) 1사단, 육군훈련소
   * @param {ArmyRelationshipName} relationship 훈련병과의 관계 ex) 부모, 배우자,형제/자매,친구/지인,애인,친척,팬
   * @memberof ArmySoldier
   */
  constructor(soldier: ArmySoldierInterface) {
    const { soldierType, armyType, armyUnit, birthDate, enterDate, name, relationship } = soldier;

    if (!checkDate(birthDate)) {
      throw new Error('유효하지 않은 생일');
    }
    if (!checkDate(enterDate)) {
      throw new Error('유효하지 않은 입영일');
    }
    this.soldierTypeName = soldierType;
    this.soldierType = ArmySoldierType[soldierType];
    this.grpCdName = armyType;
    this.grpCd = ArmyType[armyType];
    this.name = name;
    this.birthDate = birthDate;
    this.enterDate = enterDate;
    this.trainUnitCdName = armyUnit;
    this.trainUnitCd = ArmyUnitType[armyUnit];
    this.relationShipName = relationship;
    this.relationship = ArmyRelationship[relationship];
  }
  public getEnterDateOnlyNumber(): string {
    return this.enterDate.replace(/\-/g, '');
  }
  public getBirthDateOnlyNumber(): string {
    return this.birthDate.replace(/\-/g, '');
  }
  //   public getArmyTypeName(): string {
  //     return this.grpCdName;
  //   }
}

export { ArmySoldier as ArmySoldierMIL };
