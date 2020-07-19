import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { WorldBasketballLeague, WorldBasketballLeagueArray } from "../Model";

/**
 * 해외 농구 정보를 불러오는 클래스
 * @class WorldBasketball
 */
class WorldBasketball extends SportsHistoryAbstract {
  /**
   * WorldBasketballLeague
   * @memberof WorldBasketball
   * @typedef {string} WorldBasketballLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   * NBA  | nba
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {WorldBasketballLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.worldBasketball.getHistory("nba", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: WorldBasketballLeague, date: Date) {
    try {
      return await this._getHistory<WorldBasketballLeague>(
        leagueType,
        date,
        WorldBasketballLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: WorldBasketballLeague, date: string): string {
    return `https://sports.news.naver.com/basketball/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}
export { WorldBasketball };
