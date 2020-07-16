// export interface AirForceLetter {
//   title: string;
//   body: string;
//   zipCode: string;
//   addr1: string;
//   addr2: string;
//   senderName: string;
//   relationship: string;
//   password: string;
// }

export class AirForceLetter {
  public title: string;
  public body: string;
  public zipCode: string;
  public addr1: string;
  public addr2: string;
  public senderName: string;
  public relationship: string;
  public password: string;
  /**
   *Creates an instance of AirForceLetter.
   * @param {string} title 편지 제목
   * @param {string} body 편지 내용
   * @param {string} senderName 작성자
   * @param {string} relationship 관계
   * @param {string} zipCode 우편번호
   * @param {string} addr1 주소 1
   * @param {string} addr2 주소 2
   * @param {string} password 비밀번호
   * @memberof AirForceLetter
   */
  constructor(
    title: string,
    body: string,
    senderName: string,
    relationship: string,
    zipCode: string,
    addr1: string,
    addr2: string,
    password: string
  ) {
    this.title = title;
    this.body = body;
    this.senderName = senderName;
    this.relationship = relationship;
    this.zipCode = zipCode;
    this.addr1 = addr1;
    this.addr2 = addr2;
    this.password = password;
  }
}
