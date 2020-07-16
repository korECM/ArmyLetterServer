import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { KoreaBasketballLeague, KoreaBasketballLeagueArray } from "../Model";
/**
 * 국내 농구 정보를 불러오는 클래스
 * @class KoreaBasketball
 */

class KoreaBasketball extends SportsHistoryAbstract {
  /**
   * KoreaBasketballLeague
   * @memberof KoreaBasketball
   * @typedef {string} KoreaBasketballLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   * 프로농구  | kbl
   * 여자 프로농구 | wkbl
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {KoreaBasketballLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.koreaBasketball.getHistory("kbl", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: KoreaBasketballLeague, date: Date) {
    try {
      return await this._getHistory<KoreaBasketballLeague>(
        leagueType,
        date,
        KoreaBasketballLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: KoreaBasketballLeague, date: string): string {
    return `https://sports.news.naver.com/basketball/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}
export { KoreaBasketball };
