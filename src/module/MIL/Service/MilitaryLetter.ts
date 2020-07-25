import { addSoldier, login, createCafeCheck, sendLetter, deleteSoldier, getProfileInfo, checkNickname } from './ArmyService';

import { getSoldierList, getSessionId, AirForceSendLetter } from './AirForceService';

import { ArmySoldierMIL, Cookie, ArmyLetter, AirForceSoldier, AirForceLetter } from '../Models';
import { checkEmail } from '../Utils';
import { updateNickname } from './ArmyService/updateNickname';
import { IMilitaryLetter } from './IMilitaryLetter';

class MilitaryLetter implements IMilitaryLetter {
  private soldier: ArmySoldierMIL | AirForceSoldier | null = null;
  private tempSoldierList: AirForceSoldier[] = [];
  private profileSeq?: number;
  private isLogin: boolean = false;
  private cookie: Cookie | null = null;

  constructor() {}
  /**
   * 더캠프의 경우 편지를 보내기 위해서 로그인 정보가 필요합니다
   *
   * SNS 로그인은 지원하지 않으며 매개변수로 아이디와 패스워드를 전달해야 합니다.
   *
   * @param {string} id
   * @param {string} pw
   * @memberof MilitaryLetter
   */
  public async config(id: string, pw: string) {
    if (!checkEmail(id)) {
      throw new Error('유효한 이메일 형식이 아닙니다');
    }
    if (!id || id.length === 0 || !pw || pw.length === 0) {
      throw new Error('아이디 또는 비밀번호가 제대로 전달되지 않았습니다');
    }
    try {
      let cookie = await login(id, pw);
      this.cookie = cookie!;
      this.isLogin = true;
    } catch (error) {
      this.isLogin = false;
      throw error;
    }
  }

  /**
   * @param {(ArmySoldierMIL | AirForceSoldier)} soldier 설정할 군인입니다.
   * @param {number} [selectNum=0] 해당 정보와 일치하는 훈련병이 여러명인 경우 한명을 선택하는 인덱스입니다. 기본값은 0입니다.
   * @memberof MilitaryLetter
   */
  public async setSoldier(soldier: ArmySoldierMIL | AirForceSoldier, selectNum: number = 0) {
    this.soldier = null;

    if (soldier === undefined || soldier === null) {
      console.error('군인이 제대로 전달되지 않았습니다');
      return;
    }
    this.soldier = soldier;
    if (this.soldier instanceof ArmySoldierMIL) {
      this.checkLogin();
      try {
        await addSoldier(this.soldier!, this.cookie!);
        await createCafeCheck(this.soldier!, this.cookie!);
        // await deleteSoldier(this.soldier!, this.cookie!);
      } catch (error) {
        console.error(error);
        this.soldier = null;
        return;
      }
    } else if (this.soldier instanceof AirForceSoldier) {
      this.tempSoldierList = await getSoldierList(this.soldier!);
      if (this.tempSoldierList.length === 0) {
        console.error('해당 정보와 일치하는 군인이 존재하지 않습니다');
        this.soldier = null;
        return;
      }
      await this.selectSoldier(selectNum);
    }
  }
  /**
   * 공군의 경우 주어진 정보와 일치하는 군인들을 모두 반환하는 함수입니다.
   *
   * 해당 정보와 일치하는 군인이 존재하지 않거나 `setSoldier`를 하기 전이라면 빈 배열을 반환합니다.
   * @returns {AirForceSoldier[]}
   * @memberof MilitaryLetter
   */
  public getAirForceSoldierList(): AirForceSoldier[] {
    // if (this.tempSoldierList.length === 0) {
    //   throw new Error(
    //     "해당 정보와 일치하는 군인이 존재하지 않거나 군인을 설정하지 않았습니다."
    //   );
    // }
    return this.tempSoldierList;
  }

  private async selectSoldier(selectNum: number) {
    if (this.tempSoldierList.length > 0) {
      if (selectNum >= this.tempSoldierList.length) {
        throw new Error('공군 선택 과정에서 범위를 벗어나는 인덱스가 주어졌습니다. selectNum을 다시 설정해 주세요.');
      }
      this.soldier = this.tempSoldierList[selectNum];
      this.cookie = await getSessionId(this.soldier);
    }
  }
  /**
   * 편지를 보내는 함수입니다.
   * @param {(Letter | Letter[] | AirForceLetter | AirForceLetter[])} letter  보낼 편지를 받는 매개변수입니다. 한번에 여러장을 보내고싶다면 배열로 전달하면 됩니다.
   * @memberof MilitaryLetter
   */
  public async sendLetter(letter: ArmyLetter | ArmyLetter[] | AirForceLetter | AirForceLetter[]) {
    this.checkReady();
    //TODO: Letter 잘못주면 어케 되는지 테스트 필요
    if (this.soldier instanceof ArmySoldierMIL) {
      let arrayLetter: ArmyLetter[];
      if (!(<ArmyLetter[]>letter).length) {
        arrayLetter = [<ArmyLetter>letter];
      } else {
        arrayLetter = <ArmyLetter[]>letter;
      }
      arrayLetter.map(async (letter) => {
        let letters: ArmyLetter[] = [];
        let count = 0;
        while (letter.body.length > 1490) {
          letters.push(new ArmyLetter(letter.title + ' - ' + (count + 1).toString(), letter.body.substring(0, 1490)));
          count++;
          letter.body = letter.body.substring(1490);
        }
        letters.push(new ArmyLetter(letter.title + (count === 0 ? '' : ' - ' + (count + 1).toString()), letter.body));
        letters.map(async (realLetter) => {
          await sendLetter(this.soldier! as ArmySoldierMIL, this.cookie!, realLetter);
        });
      });
    } else if (this.soldier instanceof AirForceSoldier) {
      let arrayLetter: AirForceLetter[];
      if (!(<AirForceLetter[]>letter).length) {
        arrayLetter = [<AirForceLetter>letter];
      } else {
        arrayLetter = <AirForceLetter[]>letter;
      }
      arrayLetter.map(async (letter) => {
        await AirForceSendLetter(this.cookie!, letter);
      });
    }
  }

  /**
   * 더캠프의 경우 편지 발신인을 설정해주기 위한 함수입니다.
   *
   * 이름이 중복되는 경우 닉네임을 업데이트 할 수 없습니다
   *
   * 이름 변경 선공 여부를 프라미스로 반환합니다
   * @param {string} nickname 설정할 이름
   * @returns {Promise<boolean>}
   * @memberof MilitaryLetter
   */
  public async updateNickname(nickname: string): Promise<boolean> {
    this.checkReady();
    if (!nickname || nickname.length === 0) {
      console.error('닉네임은 공백이 올 수 없습니다');
      return false;
    }
    if (this.cookie && (await this.checkNickname(nickname))) {
      return await updateNickname(this.cookie, this.profileSeq!, nickname);
    } else {
      return Promise.resolve(false);
    }
  }

  private async checkNickname(nickname: string): Promise<boolean> {
    if (this.cookie) {
      let temp = await getProfileInfo(this.cookie);
      if (temp) this.profileSeq = temp;
      else throw new Error('profileSeq 구하는데 실패');
      return await checkNickname(this.cookie, nickname);
    } else {
      return Promise.resolve(false);
    }
  }
  /**
   * 설정한 군인을 반환하는 함수입니다.
   *
   * 군인을 설정하지 않은 경우 null을 반환합니다
   * @returns {(ArmySoldierMIL | AirForceSoldier | null)}
   * @memberof MilitaryLetter
   */
  public getSoldier(): ArmySoldierMIL | AirForceSoldier | null {
    return this.soldier;
  }
  /**
   * 군인이 어디서 훈련 받는지를 반환하는 함수입니다.
   *
   * ex) 신병2대대 1중대 2소대 122호실 24번
   * @returns {string}
   * @memberof MilitaryLetter
   */
  public getTrainUnitEduName(): string {
    this.checkSoldierSet();
    if (this.soldier instanceof ArmySoldierMIL) {
      return this.soldier!.trainUnitEdNm!;
    } else if (this.soldier instanceof AirForceSoldier) {
      return this.soldier!.soldierInfo!;
    }
    return '';
  }

  /**
   * 수료일을 반환합니다.
   *
   * 날짜형식 : YYYY-MM-DD
   *
   * @returns {string}
   * @memberof MilitaryLetter
   */
  public getEndDay(): string {
    this.checkSoldierSet();
    return this.soldier!.endDate!;
  }

  private checkSoldierSet() {
    if (this.soldier === null) {
      throw new Error('설정된 군인이 없습니다');
    }
  }

  private checkLogin() {
    if (!this.isLogin) {
      throw new Error('로그인 먼저 해야합니다');
    }
  }

  private checkAirForceReady() {
    if (!this.soldier || this.tempSoldierList.length === 0) {
      throw new Error('공군을 먼저 설정해야 합니다.');
    }
  }

  private checkReady() {
    if (this.soldier instanceof ArmySoldierMIL) {
      this.checkLogin();
    } else if (this.soldier instanceof AirForceSoldier) {
      this.checkAirForceReady();
    }
  }
}

export { MilitaryLetter };
export { AirForceSoldier, ArmySoldierMIL as ArmySoldier, AirForceLetter, ArmyLetter } from '../Models';
