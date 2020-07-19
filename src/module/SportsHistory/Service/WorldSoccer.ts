import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { WorldSoccerLeague, WorldSoccerLeagueArray } from "../Model";

/**
 * 국내 축구 정보를 불러오는 클래스
 * @class WorldSoccer
 */
class WorldSoccer extends SportsHistoryAbstract {
  /**
   * WorldSoccerLeague
   * @memberof WorldSoccer
   * @typedef {string} WorldSoccerLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   * 프리미어리그  | epl
   * 라리가  | primera
   * 분데스  | bundesliga
   * 세리에 A | seria
   * 리그 1 | ligue1
   * 챔피언스리그 | champs
   * 유로파리그 |  europa
   * FA컵 | facup
   * EFL컵 | carlingcup
   * 코파델레이 | copadelrey
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {WorldSoccerLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.worldSoccer.getHistory("epl", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: WorldSoccerLeague, date: Date) {
    try {
      return await this._getHistory<WorldSoccerLeague>(
        leagueType,
        date,
        WorldSoccerLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: WorldSoccerLeague, date: string): string {
    return `https://sports.news.naver.com/wfootball/schedule/scoreboard.nhn?date=${date}&year=2015&month=02&category=${league}`;
  }
}

export { WorldSoccer };
