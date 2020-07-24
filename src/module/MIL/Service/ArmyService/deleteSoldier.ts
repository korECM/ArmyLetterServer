import { ArmySoldierMIL, Cookie } from "../../Models";
import requestPromise from "request-promise";
import { addCookie } from "../../Utils";

async function deleteSoldier(soldier: ArmySoldierMIL, cookie: Cookie) {
  if (!soldier) {
  }
  if (!cookie || !cookie.iuid || !cookie.token) {
  }

  console.log("삭제 시작");
  let cookieJar = addCookie(cookie);
  const options = {
    url: "https://www.thecamp.or.kr/missSoldier/deleteMissSoldierA.do",
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    jar: cookieJar,
    form: {
      regOrder: 1,
    },
  };
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      console.error(err);
      throw new Error(err);
    }
  });
  console.log(response);
}

export { deleteSoldier };
