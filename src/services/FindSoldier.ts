import { MilitaryLetter, ArmySoldier, ArmyLetter as ArmyLetterModel } from '../module/MIL/Service/MilitaryLetter';
import { ArmySoldierInterface, AirForceSoldierInterface, AirForceSoldier, ArmyLetter } from '../module/MIL/Models';


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
