import { MilitaryLetter, ArmySoldier, ArmyLetter } from '../module/Service/MilitaryLetter';

export async function findArmySoldier() {
  const ml = new MilitaryLetter();
  await ml.config(process.env.ID!, process.env.PW!);

  let soldier: ArmySoldier = new ArmySoldier({
    armyType: '육군',
    armyUnit: '육군훈련소',
    enterDate: '2020-06-15',
    birthDate: '1999-10-26',
    name: '김희백',
    relationship: '친구/지인',
    soldierType: '예비군인/훈련병',
  });

  await ml.updateNickname('윤종원.');

  await ml.setSoldier(soldier);
}
