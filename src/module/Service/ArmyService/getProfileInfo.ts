import { Cookie } from "../../Models";
import requestPromise from "request-promise";
import cheerio from "cheerio";
import { addCookie } from "../../Utils";

const getProfileInfo = async (cookie: Cookie) => {
  if (!cookie || !cookie.iuid || !cookie.token) {
    throw new Error("로그인 정보가 없습니다");
  }
  let cookieJar = addCookie(cookie);
  const options = {
    url: "https://www.thecamp.or.kr/member/viewMemberMgr.do",
    method: "GET",
    json: true,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    jar: cookieJar,
  };
  let profileSeq: number | null = null;
  let error = null;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      // console.error(err);
      // throw new Error(err);
      error = err;
    }
    // console.log(body);
    const $ = cheerio.load(body);
    let temp: string | null = $("#profileSeq").attr("value") || null;
    if (temp) {
      profileSeq = parseInt(temp);
    }
  });
  if (profileSeq) return profileSeq;
  if (!response) {
    console.error("응답이 없습니다");
  }
  if (error) {
    throw error;
  }
};

export { getProfileInfo };
