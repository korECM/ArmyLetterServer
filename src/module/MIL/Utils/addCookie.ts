import { Cookie } from "../Models";
import requestPromise from "request-promise";
import tough from "tough-cookie";

const addCookie = (cookie: Cookie) => {
  let iuidCookie = new tough.Cookie({
    key: "iuid",
    value: cookie.iuid,
    domain: "www.thecamp.or.kr",
    httpOnly: true,
    maxAge: 31536000,
  });
  let tokenCookie = new tough.Cookie({
    key: "Token",
    value: cookie.token,
    domain: "www.thecamp.or.kr",
    httpOnly: true,
    maxAge: 31536000,
  });

  let cookieJar = requestPromise.jar();
  cookieJar.setCookie(iuidCookie, "https://www.thecamp.or.kr");
  cookieJar.setCookie(tokenCookie, "https://www.thecamp.or.kr");
  return cookieJar;
};

const addSession = (cookie: Cookie) => {
  let tokenCookie = new tough.Cookie({
    key: "JSESSIONID",
    value: cookie.token,
    domain: "airforce.mil.kr",
    httpOnly: true,
    maxAge: 31536000,
  });

  let cookieJar = requestPromise.jar();
  cookieJar.setCookie(tokenCookie, "http://airforce.mil.kr");
  return cookieJar;
};

export { addCookie, addSession };
