/**
 *
 *@typedef Information
 * @export
 * @interface Information
 * @example
 * [ { homeTeamName: 'LG',
    awayTeamName: '삼성',
    homeTeamScore: '0',
    awayTeamScore: '0',
    gameDate: '2020-04-22',
    state: '18:30',
    title: '',
    stadium: '잠실' },
  { homeTeamName: 'SK',
    awayTeamName: '두산',
    homeTeamScore: '0',
    awayTeamScore: '0',
    gameDate: '2020-04-22',
    state: '18:30',
    title: '',
    stadium: '문학' },]
 */
export interface Information {
  /**
   * Home팀 이름
   */
  homeTeamName: string;
  /**
   * Away팀 이름
   */
  awayTeamName: string;
  /**
   * Home팀팀 점수
   */
  homeTeamScore: string;
  /**
   * Away팀 점수
   */
  awayTeamScore: string;
  /**
   * 경기가 이루어진 날 또는 이루어 질 날
   */
  gameDate: string;
  /**
   * 종료 되었으면 종료
   *
   * 아니라면 경기가 시작 할 시간
   */
  state: string;
  /**
   * 경기 이름
   *
   * 값이 있음을 보장하지 않음
   */
  title: string;
  /**
   * 경기가 이루어지는 장소
   *
   * 값이 있음을 보장하지 않음
   */
  stadium: string;
}
