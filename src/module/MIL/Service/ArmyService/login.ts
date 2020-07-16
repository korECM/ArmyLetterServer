import { extractCookie } from "../../Utils";
import { Cookie } from "../../Models";
import requestPromise from "request-promise";

const login = async (id: string, pw: string): Promise<Cookie | null> => {
  let options = {
    method: "POST",
    url: "https://www.thecamp.or.kr/login/loginA.do",
    headers: {
      "Content-Type": [
        "application/x-www-form-urlencoded",
        "application/x-www-form-urlencoded",
      ],
    },
    form: {
      state: "email-login",
      autoLoginYn: "N",
      userId: id,
      userPwd: pw,
    },
    resolveWithFullResponse: true,
  };

  let cookie: Cookie | null = null;
  return requestPromise(options)
    .then((res) => {
      let body = res.body;
      // console.log(res.statusCode, `-`, res.statusMessage, " ", JSON.parse(body));
      if (res.statusCode === 200 && JSON.parse(body).resultCd === "9001") {
        throw new Error("아이디나 비밀번호가 틀렸습니다");
      }
      // 로그인 성공시 더캠프가 resultCd가 코드를 반환 안하는 것으로 바뀌어서 일단 주석 처리
      // if (res.statusCode === 200 && JSON.parse(body).resultCd !== "0000") {
      //   throw new Error("모르는 에러");
      // }
      // console.log(res.headers["set-cookie"]);
      if (!res.headers["set-cookie"]) {
        throw new Error("아이디나 비밀번호가 틀렸습니다");
      }
      cookie = extractCookie(res.headers["set-cookie"]!);
      // console.log(cookie);
      if (!cookie) {
        throw new Error("네트워크 에러");
      }
      return cookie!;
    })
    .catch((error) => {
      throw error;
    });
  return cookie;
};

export { login };
