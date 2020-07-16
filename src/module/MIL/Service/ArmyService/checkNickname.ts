import { ArmySoldier, Cookie } from "../../Models";
import requestPromise from "request-promise";
import { addCookie } from "../../Utils";

const checkNickname = async (
  cookie: Cookie,
  nickName: string
): Promise<boolean> => {
  if (!cookie || !cookie.iuid || !cookie.token) {
    throw new Error("로그인 정보가 없습니다");
  }
  let cookieJar = addCookie(cookie);
  const options = {
    url: "https://www.thecamp.or.kr/profile/selectCheckProfileA.do",
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    jar: cookieJar,
    form: {
      nickname: nickName,
    },
  };
  let isNotExisted: boolean = false;
  let error = null;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      // console.error(err);
      error = err;
      // throw new Error(err);
    }
    if (res.statusCode === 200 && body.resultCd !== "0000")
      isNotExisted = false;
    else isNotExisted = true;
  });
  if (!response) {
    console.error("응답이 없습니다");
  }
  if (error) {
    throw error;
  }
  return isNotExisted;
};

export { checkNickname };
