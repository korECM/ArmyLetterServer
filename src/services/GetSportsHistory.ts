import SH from '../module/SportsHistory/Service/SportsHistory';
import { SportHistoryDataInterface as SportsHistoryDataInterface } from '../module/SportsHistory/Service';

type SportsType = 'eSports' | 'koreaBaseball' | 'koreaBasketball' | 'koreaSoccer' | 'worldBaseball' | 'worldBasketball' | 'worldSoccer';

export default class SportsHistory {
  private sh: SH;
  constructor() {
    this.sh = new SH();
  }

  async getHistory(sports: SportsType, leagueType: string, date: Date) {
    const rawData = await this.getData(sports, leagueType, date);
    return this.toText(rawData, sports, leagueType, date);
  }

  private getData(sports: SportsType, leagueType: string, date: Date) {
    switch (sports) {
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

  private toText(rawData: SportsHistoryDataInterface[] | undefined, sports: SportsType, leagueType: string, date: Date) {
    let resultString = '';
    if (rawData?.length) {
      resultString = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `;
      resultString += '\n===========================================\n';
      resultString += `${this.sportsToText(sports)} - ${this.leagueToText(sports, leagueType)}\n\n`;
      rawData.forEach((data) => {
        resultString += `${data.title}\n`;
        resultString += `${data.gameDate}(${data.state})\n`;
        resultString += `${data.awayTeamName} ${data.awayTeamScore} : ${data.homeTeamScore} ${data.homeTeamName}\n\n`;
      });
      resultString += '===========================================\n';
    }
    return resultString;
  }

  private sportsToText(sports: SportsType) {
    switch (sports) {
      case 'eSports':
        return 'E스포츠';
      case 'koreaBaseball':
        return '한국 야구';
      case 'koreaBasketball':
        return '한국 농구';
      case 'koreaSoccer':
        return '한국 축구';
      case 'worldBaseball':
        return '해외 야구';
      case 'worldBasketball':
        return '해외 농구';
      case 'worldSoccer':
        return '해외 축구';
    }
  }

  private leagueToText(sport: SportsType, leagueType: string) {
    switch (sport) {
      case 'worldSoccer':
        switch (leagueType) {
          case 'epl':
            return '프리미어리그';
          case 'bundesliga':
            return '분데스';
          case 'primera':
            return '라리가';
          case 'seria':
            return '세리에 A';
          case 'ligue1':
            return '리그 1';
          case 'champs':
            return '챔피언스리그';
          case 'europa':
            return '유로파리그';
          case 'facup':
            return 'FA컵';
          case 'carlingcup':
            return 'EFL컵';
          case 'copadelrey':
            return '코파델레이';
        }
      case 'koreaBaseball':
        return 'KBO 리그';
      case 'koreaBasketball':
        switch (leagueType) {
          case 'kbl':
            return '프로 농구';
          case 'wkbl':
            return '여자 프로 농구';
        }
      case 'koreaSoccer':
        switch (leagueType) {
          case 'kleague':
            return 'K리그 1';
          case 'kleagu2':
            return 'K리그 2';
          case 'amatch':
            return '국가대표';
          case 'acl':
            return 'AFC 챔피언스 리그';
        }
      case 'worldBaseball':
        switch (leagueType) {
          case 'mlb':
            return '메이저리그';
          case 'npb':
            return '일본 프로야구';
        }
      case 'worldBasketball':
        return 'NBA';
      case 'eSports':
        switch (leagueType) {
          case 'lol':
            return '리그오브레전드';
          case 'starcraft2':
            return '스타크래프트2';
          case 'overwatch':
            return '오버워치';
        }
    }
  }
}
