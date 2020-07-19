import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { KoreaSoccerLeague, KoreaSoccerLeagueArray } from "../Model";
/**
 * 국내 축구 정보를 불러오는 클래스
 * @class KoreaSoccer
 */
class KoreaSoccer extends SportsHistoryAbstract {
  /**
   * KoreaSoccerLeague
   * @memberof KoreaSoccer
   * @typedef {string} KoreaSoccerLeague
   * @description
   * 리그 이름 | 값
   *------------- | -------------
   *K리그 1  | kleague
   *K리그 2  | kleague2
   * 국가대표  | amatch
   * AFC 챔피언스 리그  | acl
   */

  /**
   * 주어진 날에 열린 해당 리그 경기를 가져온다
   * @param {KoreaSoccerLeague} leagueType 찾고자 하는 리그
   * @param {Date} date 경기를 한 날짜
   * @returns {Promise<Information>} 경기 결과를 배열 형태로 반환하는 Promise
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.koreaSoccer.getHistory("kleague", new Date("2020/02/20"));
   * console.log(data);
   */
  public async getHistory(leagueType: KoreaSoccerLeague, date: Date) {
    try {
      return await this._getHistory<KoreaSoccerLeague>(
        leagueType,
        date,
        KoreaSoccerLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: KoreaSoccerLeague, date: string): string {
    return `https://sports.news.naver.com/kfootball/schedule/scoreboard.nhn?year=2020&month=05&category=${league}&date=${date}`;
  }
}
export { KoreaSoccer };
