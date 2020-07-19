/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type KoreaSoccerLeague =
  /**
   * K리그 1
   */
  | "kleague"
  /**
   * K리그 2
   */
  | "kleague2"
  /**
   * 국가대표
   */
  | "amatch"
  /**
   * AFC 챔피언스리그
   */
  | "acl";

export const KoreaSoccerLeagueArray: KoreaSoccerLeague[] = [
  "acl",
  "amatch",
  "kleague",
  /**
   K리그 2
   */
  "kleague2",
];
