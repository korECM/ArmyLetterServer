import { ArmySoldierMIL, Cookie, ArmyLetter } from "../../Models";
import requestPromise from "request-promise";
import { addCookie } from "../../Utils";

const sendLetter = async (
  soldier: ArmySoldierMIL,
  cookie: Cookie,
  content: ArmyLetter
) => {
  if (!soldier) {
    throw new Error("유효하지 않은 군인 정보입니다");
  }
  if (!cookie || !cookie.iuid || !cookie.token) {
    throw new Error("로그인 정보가 없습니다");
  }
  if (!soldier.traineeMgrSeq) {
    throw new Error("훈련병의 카페 정보가 없습니다");
  }

  // if (!content.body || !content.title) {
  // }

  let cookieJar = addCookie(cookie);

  const options = {
    url: "https://www.thecamp.or.kr/consolLetter/insertConsolLetterA.do",
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    jar: cookieJar,
    form: {
      boardDiv: "sympathyLetter",
      tempSaveYn: "N",
      traineeMgrSeq: soldier.traineeMgrSeq,
      sympathyLetterContent: content.body
        .replace(/\n/g, "<br/>")
        .replace(/ /g, "&nbsp;"),
      sympathyLetterSubject: content.title,
    },
  };
  let error = null;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      // console.error(err);
      // throw new Error(err);
      error = err;
    }
  });
  if (!response) {
    console.error("응답이 없습니다");
  }
  if (error) {
    throw error;
  }
};

export { sendLetter };
