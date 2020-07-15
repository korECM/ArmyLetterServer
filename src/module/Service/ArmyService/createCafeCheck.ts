import { ArmySoldier, Cookie } from '../../Models';
import requestPromise from 'request-promise';
import { addCookie } from '../../Utils';

const createCafeCheck = async (soldier: ArmySoldier, cookie: Cookie) => {
  if (!soldier) {
  }
  if (!cookie || !cookie.iuid || !cookie.token) {
  }

  let cookieJar = addCookie(cookie);
  const options = {
    url: 'https://www.thecamp.or.kr/main/cafeCreateCheckA.do',
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    jar: cookieJar,
    form: {
      name: soldier.name,
      birth: soldier.getBirthDateOnlyNumber(),
      enterDate: soldier.getEnterDateOnlyNumber(),
    },
  };
  let error = null;
  const response = await requestPromise(options, (err, res, body) => {
    if (err) {
      throw new Error(err);
    }
    console.log(res.statusCode, `-`, res.statusMessage, ' ', body);
    if (res.statusCode === 200 && body.resultCd !== '0000' && body.resultCd !== '9999') {
      error = new Error('훈련병 정보가 잘못 되었거나 아직 카페가 개설되지 않았습니다');
      // throw new Error(
      //   "훈련병 정보가 잘못 되었거나 아직 카페가 개설되지 않았습니다"
      // );
    }
    if (body.listResult.length === 1) {
      soldier.traineeMgrSeq = body.listResult[0].traineeMgrSeq;
      soldier.trainUnitEdNm = body.listResult[0].trainUnitEduNm;
      soldier.endDate = body.listResult[0].mainDate;
      soldier.traineeNum = body.listResult[0].traineeNum;
    }
  });
  if (!response) {
    console.error('응답이 없습니다');
  }
  if (error) {
    throw error;
  }
};

export { createCafeCheck };
