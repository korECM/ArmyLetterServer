import request from "request-promise";
import { Cookie } from "../../Models";
import { extractSessionCookie } from "../../Utils";
import { AirForceSoldier } from "../../Models";
async function getSessionId(soldier: AirForceSoldier) {
  let options = {
    method: "GET",
    url: encodeURI(
      `http://airforce.mil.kr:8081/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=sub&dum=dum&command2=getEmailList&searchName=${soldier.name}&searchBirth=${soldier.birthDate}&memberSeq=${soldier.traineeNum}`
    ),
    headers: {
      "Content-Type": ["application/x-www-form-urlencoded"],
      Referer:
        "http://airforce.mil.kr:8081/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=sub&dum=dum&",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36",
    },
  };

  let cookie: Cookie | null = null;
  let error = null;
  try {
    const response = await request(options, (err, res, body) => {
      if (err) {
        // console.error("error");
        // throw new Error("네트워크 에러");
        error = new Error("네트워크 에러");
        return;
      }
      //   console.log(res.headers["set-cookie"]);
      if (!res.headers["set-cookie"]) {
        error = new Error("해당 공군 정보를 찾을 수 없습니다");
        // throw new Error("해당 공군 정보를 찾을 수 없습니다");
      }
      cookie = extractSessionCookie(res.headers["set-cookie"]!);
    });
    if (!response || !cookie) {
      console.error("응답 에러");
      throw new Error("응답 에러");
    }
    if (error) {
      throw error;
    }
    return cookie;
  } catch (error) {
    throw error;
    // return cookie;
  }
}

export { getSessionId };
