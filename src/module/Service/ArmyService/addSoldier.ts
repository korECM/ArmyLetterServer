import { ArmySoldier, Cookie } from '../../Models';
import requestPromise from 'request-promise';
import { addCookie, checkDate } from '../../Utils';

async function addSoldier(soldier: ArmySoldier, cookie: Cookie) {
  if (!soldier) {
    throw new Error('유효하지 않은 군인 정보입니다');
  }
  if (!cookie || !cookie.iuid || !cookie.token) {
    throw new Error('로그인 정보가 없습니다');
  }
  if (!checkDate(soldier.birthDate)) {
    throw new Error('유효하지 않은 생일');
  }
  if (!checkDate(soldier.enterDate)) {
    throw new Error('유효하지 않은 입영일');
  }
  let cookieJar = addCookie(cookie);
  const options = {
    url: 'https://www.thecamp.or.kr/missSoldier/insertDirectMissSoldierA.do',
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    jar: cookieJar,
    form: {
      missSoldierClassCdNm: soldier.soldierTypeName,
      grpCdNm: soldier.grpCdName,
      missSoldierClassCd: soldier.soldierType,
      trainUnitCd: soldier.trainUnitCd,
      grpCd: soldier.grpCd,
      name: soldier.name,
      birth: soldier.birthDate,
      enterDate: soldier.enterDate,
      iuid: cookie.iuid,
      missSoldierRelationshipCd: soldier.relationship,
    },
  };
  let error = null;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      console.error(err);
      throw new Error(err);
    }
    // console.log(res.statusCode, `-`, res.statusMessage, " ", body);
    if (res.statusCode === 200 && body.resultCd !== '0000' && body.resultCd !== 'E001') {
      error = new Error('모르는 에러');
      // throw new Error("모르는 에러");
    }
    if (res.statusCode === 200 && body.resultCd === 'E001') {
      // throw new Error(body.resultMsg);
      console.log(soldier.name, " : ",body.resultMsg);
    }
  });
  if (!response) {
    console.error('응답 없음');
  }
  if (error) {
    throw error;
  }
}

export { addSoldier };
