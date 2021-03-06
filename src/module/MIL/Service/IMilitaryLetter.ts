/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2020-07-25 14:08:21
 */
import { ArmySoldierMIL, Cookie, ArmyLetter, AirForceSoldier, AirForceLetter } from '../Models';

export interface IMilitaryLetter {
  /**
   * 더캠프의 경우 편지를 보내기 위해서 로그인 정보가 필요합니다
   *
   * SNS 로그인은 지원하지 않으며 매개변수로 아이디와 패스워드를 전달해야 합니다.
   *
   * @param {string} id
   * @param {string} pw
   * @memberof MilitaryLetter
   */
  config(id: string, pw: string): any;
  /**
   * @param {(ArmySoldierMIL | AirForceSoldier)} soldier 설정할 군인입니다.
   * @param {number} [selectNum=0] 해당 정보와 일치하는 훈련병이 여러명인 경우 한명을 선택하는 인덱스입니다. 기본값은 0입니다.
   * @memberof MilitaryLetter
   */
  setSoldier(soldier: ArmySoldierMIL | AirForceSoldier, selectNum?: number): any;
  /**
   * 공군의 경우 주어진 정보와 일치하는 군인들을 모두 반환하는 함수입니다.
   *
   * 해당 정보와 일치하는 군인이 존재하지 않거나 `setSoldier`를 하기 전이라면 빈 배열을 반환합니다.
   * @returns {AirForceSoldier[]}
   * @memberof MilitaryLetter
   */
  getAirForceSoldierList(): {};
  /**
   * 편지를 보내는 함수입니다.
   * @param {(Letter | Letter[] | AirForceLetter | AirForceLetter[])} letter  보낼 편지를 받는 매개변수입니다. 한번에 여러장을 보내고싶다면 배열로 전달하면 됩니다.
   * @memberof MilitaryLetter
   */
  sendLetter(letter: ArmyLetter | ArmyLetter[] | AirForceLetter | AirForceLetter[]): any;
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
  updateNickname(nickname: string): any;
  /**
   * 설정한 군인을 반환하는 함수입니다.
   *
   * 군인을 설정하지 않은 경우 null을 반환합니다
   * @returns {(ArmySoldierMIL | AirForceSoldier | null)}
   * @memberof MilitaryLetter
   */
  getSoldier(): AirForceSoldier | ArmySoldierMIL | null;
  /**
   * 군인이 어디서 훈련 받는지를 반환하는 함수입니다.
   *
   * ex) 신병2대대 1중대 2소대 122호실 24번
   * @returns {string}
   * @memberof MilitaryLetter
   */
  getTrainUnitEduName(): string;
  /**
   * 수료일을 반환합니다.
   *
   * 날짜형식 : YYYY-MM-DD
   *
   * @returns {string}
   * @memberof MilitaryLetter
   */
  getEndDay(): string;
}
