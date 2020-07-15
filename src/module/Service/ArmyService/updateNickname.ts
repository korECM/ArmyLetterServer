import { ArmySoldier, Cookie } from "../../Models";
import requestPromise from "request-promise";
import { addCookie } from "../../Utils";

const updateNickname = async (
  cookie: Cookie,
  profileSeq: number,
  nickName: string
): Promise<boolean> => {
  if (!cookie || !cookie.iuid || !cookie.token) {
    throw new Error("로그인 정보가 없습니다");
  }
  let cookieJar = addCookie(cookie);
  const options = {
    url: "https://www.thecamp.or.kr/profile/updateMemberProfileA.do",
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    jar: cookieJar,
    form: {
      nickname: nickName,
      profileSeq: profileSeq,
    },
  };
  console.log(options);
  let isSuccess: boolean = false;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      console.error(err);
      throw new Error(err);
    }
    if (res.statusCode === 200 && body.resultCd !== "0000") isSuccess = false;
    else isSuccess = true;
  });
  if (!response) {
    console.error("응답이 없습니다");
  }
  return isSuccess;
};

export { updateNickname };
