import request from 'request-promise';
import Letter from '../models/Letter';
import ArmySoldierMIL, { ArmySoldierDB } from '../models/ArmySoldier';
import AirForceSoldier, { AirForceSoldierDB } from '../models/AirForceSoldier';

export async function getCoronaInfo() {
  try {
    const response = JSON.parse(await request('https://coronaboard.kr/generated/KR.json'));

    const { death_acc, released_acc, confirmed_acc, confirmed, death, released } = response;

    const releasedAccToday = (released_acc as number[]).pop();
    const deathAccToday = (death_acc as number[]).pop();
    const confirmedAccToday = (confirmed_acc as number[]).pop();

    const releasedToday = (released as number[]).pop();
    const deathToday = (death as number[]).pop();
    const confirmedToday = (confirmed as number[]).pop();

    return { releasedAccToday, deathAccToday, confirmedAccToday, releasedToday, deathToday, confirmedToday };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function coronaToString() {
  try {
    const apiInfo = await getCoronaInfo();
    if (apiInfo) {
      const { releasedAccToday, deathAccToday, confirmedAccToday, releasedToday, deathToday, confirmedToday } = apiInfo;
      let date = new Date();
      let resultString = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 코로나 정보`;
      resultString += '\n======================================================\n';
      resultString += `확진자 : ${confirmedAccToday}(${confirmedToday}) 사망자 : ${deathAccToday}(${deathToday}) 격리 해제 : ${releasedAccToday}(${releasedToday})`;
      resultString += '\n======================================================\n';
      return resultString;
    }
  } catch (error) {
    console.error(error);
  }
  return '';
}

export async function saveCoronaLetter() {
  console.log('코로나 편지 작성 시작');

  try {
    let content = await coronaToString();
    if (content.length) {
      console.log(content);
      let date = new Date();
      let letter = new Letter({
        title: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 코로나 정보`,
        body: content,
      });

      await letter.save();

      let armyDB = new ArmySoldierDB();
      let airForceDB = new AirForceSoldierDB();
      let armySoldiers = await armyDB.findSoldiers({ corona: true });
      let airForceSoldiers = await airForceDB.findSoldiers({ corona: true });

      for (let soldier of armySoldiers) {
        await armyDB.saveLetter(soldier, letter);
      }
      for (let soldier of airForceSoldiers) {
        await airForceDB.saveLetter(soldier, letter);
      }
    } else {
      console.log('No Content');
    }
  } catch (error) {
    console.error(error);
  }
}
