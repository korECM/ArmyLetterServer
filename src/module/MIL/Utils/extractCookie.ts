import { Cookie } from "../Models";

export const extractCookie = (data: string[]): Cookie => {
  const iuid: string = data
    .filter((e) => e.includes("iuid"))[0]
    .split(";")[0]
    .split("=")[1];
  const token: string = data
    .filter((e) => e.includes("Token"))[0]
    .split(";")[0]
    .split("=")[1];
  // console.log(iuid);
  // console.log(token);
  return { iuid, token } as Cookie;
};

export const extractSessionCookie = (data: string[]): Cookie => {
  const iuid: string = "";
  const token: string = data
    .filter((e) => e.includes("JSESSIONID"))[0]
    .split(";")[0]
    .split("=")[1];
  // console.log(iuid);
  // console.log(token);
  return { iuid, token } as Cookie;
};
