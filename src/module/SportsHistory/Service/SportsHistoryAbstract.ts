import { Information, WorldBaseballLeague, WorldSoccerLeague, WorldBaseballLeagueArray, WorldSoccerLeagueArray } from '../Model';
import { WorldSoccer, WorldBaseball, KoreaBaseball, KoreaSoccer, ESports, KoreaBasketball, WorldBasketball, KoreaVolleyball } from '.';
import request from 'request-promise';
// import cheerio from "cheerio";

export interface SportHistoryDataInterface {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamScore: string;
  awayTeamScore: string;
  gameDate: string;
  state: string;
  title: string;
  stadium: string;
}

class SportsHistoryAbstract {
  //   public koreaVolleyball = () => new KoreaVolleyball();

  constructor(api: any = null) {
    if (api) this.callAPI = api;
  }

  protected async _getHistory<League>(leagueType: League, date: Date, leagueTypeArray: League[]) {
    try {
      if (this.leagueErrorCheck<League>(leagueType, date, leagueTypeArray)) {
        let inDate: string = this.getDateStringFromDate(date);
        let rawData: any[] = await this.callAPI(leagueType, inDate);
        return this.parseData(rawData);
      }
    } catch (error) {
      throw error;
    }
  }

  //   protected async _getHistoryCheerio<League>(
  //     leagueType: League,
  //     date: Date,
  //     leagueTypeArray: League[]
  //   ) {
  //     try {
  //       if (this.leagueErrorCheck<League>(leagueType, date, leagueTypeArray)) {
  //         let inDate: string = this.getDateStringFromDate(date);
  //         let rawData: any[] = await this.callAPICheerio(leagueType, inDate);
  //         return this.parseData(rawData);
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  private leagueErrorCheck<League>(leagueType: League, date: Date, leagueTypeArray: League[]) {
    if (!leagueType || !leagueTypeArray.includes(leagueType)) throw new Error('리그 타입이 적절하지 않습니다');
    if (!date) throw new Error('특정 날짜를 Date 객체로 전달해야 합니다');
    if (!this.checkYearValid(date)) throw new Error('2010년 이전 정보는 조회할 수 없습니다');
    return true;
  }

  protected getDateStringFromDate(date: Date): string {
    if (date instanceof Date) {
      let dateString = `${date.getFullYear()}${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}${
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      }`;
      if (this.checkDate(dateString)) {
        return dateString;
      }
    }
    throw new Error('유효하지 않은 날짜 형식');
  }

  protected parseData(rawData: any[]) {
    let Data: SportHistoryDataInterface[] = [];
    rawData.map((data: any) => {
      Data.push({
        homeTeamName: data.homeTeamName,
        awayTeamName: data.awayTeamName,
        homeTeamScore: data.homeTeamScore,
        awayTeamScore: data.awayTeamScore,
        gameDate: data.gameStartDate,
        state: data.state,
        title: data.title || '',
        stadium: data.stadium || '',
      });
    });
    return Data;
  }

  protected checkDate = (date: string) => {
    let dayRegExp = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
    if (dayRegExp.test(date)) return true;
    return false;
  };

  protected checkYearValid(date: Date) {
    if (date.getFullYear() < 2010) {
      return false;
    }
    return true;
  }

  protected makeLink(league: any, date: string): string {
    throw new Error('makeLink 구현 안 됨');
    return '';
  }

  protected async callAPI(league: any, date: string) {
    let options = {
      method: 'GET',
      url: this.makeLink(league, date),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
      },
    };
    try {
      let data: object[] | null = null;
      await request(options, (err: any, response: any) => {
        data = JSON.parse(response.body).scoreboardList;
      });
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  //   protected async callAPICheerio(league: any, date: string) {
  //     let options = {
  //       method: "GET",
  //       url: this.makeLink(league, date),
  //       headers: {
  //         "Content-Type": "application/json;charset=UTF-8",
  //         "User-Agent":
  //           "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
  //       },
  //     };
  //     try {
  //       let data: object[] | null = null;
  //       await request(options, (err: any, response: any) => {
  //         //   data = JSON.parse(response.body).scoreboardList;
  //         const $ = cheerio.load(response.body);
  //         console.log(response.body);
  //       });
  //       return data || [];
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}

export { SportsHistoryAbstract };
