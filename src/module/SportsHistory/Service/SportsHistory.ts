import { WorldSoccer, WorldBaseball, KoreaBaseball, KoreaSoccer, ESports, KoreaBasketball, WorldBasketball, KoreaVolleyball } from '.';
/**
 * 각종 스포츠 경기를 불러오기 위한 클래스
 */
class SportsHistory {
  /**
   * @type {WorldSoccer}
   * @description
   * 해외 축구 정보
   */
  public worldSoccer: WorldSoccer;
  /**
   * @type {KoreaSoccer}
   * @description
   * 국내 축구 정보
   */
  public koreaSoccer: KoreaSoccer;
  /**
   * @type {WorldBaseball}
   * @description
   * 해외 야구 정보
   */
  public worldBaseball: WorldBaseball;
  /**
   * @type {KoreaBaseball}
   * @description
   * 국내 야구 정보
   */
  public koreaBaseball: KoreaBaseball;
  /**
   * @type {ESports}
   * @description
   * E-Sports 정보
   */
  public eSports: ESports;
  /**
   * @type {KoreaBasketball}
   * @description
   * 국내 농구 정보
   */
  public koreaBasketball: KoreaBasketball;
  /**
   * @type {WorldBasketball}
   * @description
   * 해외 농구 정보
   */
  public worldBasketball: WorldBasketball;

  /**
   * SportsHistory 생성자
   * @example
   * const sh = new SportsHistory();
   * let data = await sh.worldSoccer.getHistory("epl", new Date("2020/02/20"));
   */
  constructor() {
    /**
     * @ignore
     */
    this.worldSoccer = new WorldSoccer();
    /**
     * @ignore
     */
    this.koreaSoccer = new KoreaSoccer();
    /**
     * @ignore
     */
    this.koreaBasketball = new KoreaBasketball();
    /**
     * @ignore
     */
    this.worldBasketball = new WorldBasketball();
    /**
     * @ignore
     */
    this.koreaBaseball = new KoreaBaseball();
    /**
     * @ignore
     */
    this.worldBaseball = new WorldBaseball();
    /**
     * @ignore
     */
    this.eSports = new ESports();
  }
}

export default SportsHistory;
