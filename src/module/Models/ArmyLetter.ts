// export interface Letter {
//   title: string;
//   body: string;

export class ArmyLetter {
  public title: string;
  public body: string;
  /**
   *Creates an instance of Letter.
   * @param {string} title 편지 제목
   * @param {string} body 편지 내용
   * @memberof Letter
   */
  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }
}
