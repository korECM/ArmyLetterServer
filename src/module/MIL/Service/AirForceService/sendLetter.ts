import request from "request-promise";
import { Cookie, AirForceLetter } from "../../Models";
async function AirForceSendLetter(cookie: Cookie, letter: AirForceLetter) {
  let options = {
    method: "POST",
    url: "http://airforce.mil.kr:8081/user/emailPicSaveEmail.action",
    headers: {
      "Content-Type": [
        "application/json;charset=UTF-8",
        "application/x-www-form-urlencoded",
      ],
      Cookie: [`JSESSIONID=${cookie.token}`],
    },
    form: {
      command2: "writeEmail",
      senderZipcode: letter.zipCode,
      senderAddr1: letter.addr1,
      senderAddr2: letter.addr2,
      senderName: letter.senderName,
      relationship: letter.relationship,
      title: letter.title,
      contents: letter.body,
      password: letter.password,
    },
  };
  try {
    const response = await request(options, (err, res, body) => {
      if (err) {
        console.error("error");
        throw new Error("네트워크 에러");
      }
      console.log("편지 전송 완료");
    });
    if (!response || !cookie) {
      console.error("응답 에러");
      throw new Error("응답 에러");
    }
  } catch (error) {}
}

export { AirForceSendLetter };
