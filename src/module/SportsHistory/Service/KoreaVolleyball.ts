import { SportsHistoryAbstract } from "./SportsHistoryAbstract";
import { KoreaVolleyballLeague, KoreaVolleyballLeagueArray } from "../Model";

class KoreaVolleyball extends SportsHistoryAbstract {
  public async getHistory(leagueType: KoreaVolleyballLeague, date: Date) {
    try {
      return await this._getHistory<KoreaVolleyballLeague>(
        leagueType,
        date,
        KoreaVolleyballLeagueArray
      );
    } catch (error) {
      throw error;
    }
  }

  protected makeLink(league: KoreaVolleyballLeague, date: string): string {
    return `https://sports.news.naver.com/schedule/scoreBoard.nhn?category=${league}&date=${date}`;
  }
}
export { KoreaVolleyball };
