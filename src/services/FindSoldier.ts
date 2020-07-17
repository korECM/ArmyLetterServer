import { MilitaryLetter, ArmySoldier, ArmyLetter as ArmyLetterModel } from '../module/MIL/Service/MilitaryLetter';
import { ArmySoldierInterface, AirForceSoldierInterface, AirForceSoldier, ArmyLetter } from '../module/MIL/Models';

export async function sendArmySoldierLetter(soldier: ArmySoldierInterface, letter: ArmyLetter) {
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

    await ml.sendLetter(letter);
  } catch (error) {
    console.error(error);
    return null;
  }
}

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

export async function findAirForceSoldier(soldier: AirForceSoldierInterface) {
  const ml = new MilitaryLetter();

  let targetSoldier: AirForceSoldier = new AirForceSoldier(soldier);

  try {
    await ml.setSoldier(targetSoldier);

    return ml.getSoldier();
  } catch (error) {
    console.error(error);
    return null;
  }
}
