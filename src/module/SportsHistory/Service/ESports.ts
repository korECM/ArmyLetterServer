import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { ESportsLeague, ESportsLeagueArray } from "../Model";

/**
 * E-Sports 정보를 불러오는 클래스
 * @class ESports
 */
class ESports extends SportsHistoryAbstract {
  /**
   * ESportsLeague
   * @memberof ESports
   * @typedef {string} ESportsLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   * 리그오브레전드  | lol
   * 스타크래프트2 | starcraft2
   * 오버워치 | overwatch
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {ESportsLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.eSports.getHistory("lol", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: ESportsLeague, date: Date) {
    try {
      return await this._getHistory<ESportsLeague>(
        leagueType,
        date,
        ESportsLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: ESportsLeague, date: string): string {
    return `https://sports.news.naver.com/esports/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}

export { ESports };
