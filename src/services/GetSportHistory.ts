import SH from '../module/SportsHistory/Service/SportsHistory';
import { SportHistoryDataInterface } from '../module/SportsHistory/Service';
import { raw } from 'express';

type SportType = 'eSports' | 'koreaBaseball' | 'koreaBasketball' | 'koreaSoccer' | 'worldBaseball' | 'worldBasketball' | 'worldSoccer';

export default class SportHistory {
  private sh: SH;
  constructor() {
    this.sh = new SH();
  }

  async getHistory(sport: SportType, leagueType: string, date: Date) {
    const rawData = await this.getData(sport, leagueType, date);
    return this.toText(rawData, sport, leagueType, date);
  }

  private getData(sport: SportType, leagueType: string, date: Date) {
    switch (sport) {
      case 'eSports':
        return this.sh.eSports.getHistory(leagueType as any, date);
      case 'koreaBaseball':
        return this.sh.koreaBaseball.getHistory(leagueType as any, date);
      case 'koreaBasketball':
        return this.sh.koreaBasketball.getHistory(leagueType as any, date);
      case 'koreaSoccer':
        return this.sh.koreaSoccer.getHistory(leagueType as any, date);
      case 'worldBaseball':
        return this.sh.worldBaseball.getHistory(leagueType as any, date);
      case 'worldBasketball':
        return this.sh.worldBasketball.getHistory(leagueType as any, date);
      case 'worldSoccer':
        return this.sh.worldSoccer.getHistory(leagueType as any, date);
    }
  }

  private toText(rawData: SportHistoryDataInterface[] | undefined, sport: SportType, leagueType: string, date: Date) {
    if (rawData) {
      let resultString = `${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDay()}일 `;
      resultString += `${}`;
    }
    return '';
  }

  private leagueToText(sport: SportType, leagueType: string){
      switch(sport){
          case "worldSoccer":
              switch (leagueType) {
                  case "epl":
                      return "프리미어리그"
                case "bundesliga":
                    return "분데스"
                case "primera":
                    return "라리가"
                case "seria":
                return "세리에 A"
                case "ligue1":
                    return "리그 1"
                case "champs":
                    return "챔피언스리그"
                case "europa":
                    return "유로파리그"
                case "facup":
                    return "FA컵"
                case "carlingcup":
                    return "EFL컵"
                case "copadelrey":
                    return "코파델레이"
              }
      }
  }
}
