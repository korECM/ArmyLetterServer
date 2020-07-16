import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { WorldBaseballLeague, WorldBaseballLeagueArray } from "../Model";

/**
 * 해외 야구 정보를 불러오는 클래스
 * @class WorldBaseball
 */
class WorldBaseball extends SportsHistoryAbstract {
  /**
   * KoreaSoccerLeague
   * @memberof WorldBaseball
   * @typedef {string} WorldBaseballLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   * 메이저리그  | mlb
   * 일본 프로야구 | npb
   */
  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {WorldBaseballLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.worldBaseball.getHistory("mlb", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: WorldBaseballLeague, date: Date) {
    try {
      return await this._getHistory<WorldBaseballLeague>(
        leagueType,
        date,
        WorldBaseballLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: WorldBaseballLeague, date: string): string {
    return `https://sports.news.naver.com/wbaseball/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}

export { WorldBaseball };
