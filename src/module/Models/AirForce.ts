import { checkDate } from "../Utils";

class AirForceSoldier {
  public name: string;
  public birthDate: string;
  public enterDate?: string;

  public endDate?: string;

  public traineeNum?: string;

  public soldierInfo?: string;

  public imageURL?: string;

  /**
   * 공군 정보
   * @param {string} name 이름
   * @param {string} birthDate 생일 ex) 19990304
   * @memberof AirForceSoldier
   */
  constructor(
    name: string,
    birthDate: string,
    enterDate?: string,
    endDate?: string,
    traineeNum?: string,
    soldierInfo?: string,
    imageURL?: string
  ) {
    if (!checkDate(birthDate, false)) {
      throw new Error("유효하지 않은 생일");
    }
    this.name = name;
    this.birthDate = birthDate;
    this.enterDate = enterDate || "";
    this.endDate = endDate || "";
    this.traineeNum = traineeNum || "";
    this.soldierInfo = soldierInfo || "";
    this.imageURL = imageURL || "";
  }
}

export { AirForceSoldier };
