import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { KoreaBaseballLeague, KoreaBaseballLeagueArray } from "../Model";

/**
 * 국내 야구 정보를 불러오는 클래스
 * @class KoreaBaseball
 */
class KoreaBaseball extends SportsHistoryAbstract {
  /**
   * KoreaBaseballLeague
   * @memberof KoreaBaseball
   * @typedef {string} KoreaBaseballLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   *KBO 리그  | kbo
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {KoreaBaseballLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.koreaBaseball.getHistory("kbo", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: KoreaBaseballLeague, date: Date) {
    try {
      return await this._getHistory<KoreaBaseballLeague>(
        leagueType,
        date,
        KoreaBaseballLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: KoreaBaseballLeague, date: string): string {
    return `https://sports.news.naver.com/kfootball/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}
export { KoreaBaseball };
