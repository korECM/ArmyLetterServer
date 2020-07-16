import { MilitaryLetter, ArmySoldier, ArmyLetter } from '../module/Service/MilitaryLetter';
import { ArmySoldierInterface } from '../module/Models';

export async function findArmySoldier(soldier: ArmySoldierInterface) {
  const ml = new MilitaryLetter();
  try {
    await ml.config(process.env.ID!, process.env.PW!);

    let targetSoldier: ArmySoldier = new ArmySoldier({
      ...soldier,
      relationship: '친구/지인',
      soldierType: '예비군인/훈련병',
    });

    await ml.updateNickname('윤종원.');

    await ml.setSoldier(targetSoldier);

    return ml.getSoldier();
  } catch (error) {
    console.error(error);
    return null;
  }
}
