import Letter, { LetterSchemaInterface } from '../models/Letter';
import ArmySoldier from '../models/ArmySoldier';
import AirForceSoldier from '../models/AirForceSoldier';
import { findArmySoldier, sendArmySoldierLetter } from './FindSoldier';
import { ArmyLetter } from '../module/MIL/Models';

export async function sendLetterToSoldiers() {
  console.log('편지 전송 시작');

  try {
    let armySoldier = await ArmySoldier.find().populate('letters').exec();

    console.log(armySoldier);

    armySoldier.forEach(async (soldier) => {
      console.log(`${soldier.name} 편지 전송 시작`);
      (soldier.letters as LetterSchemaInterface[])
        .filter((letter) => letter.sended === false)
        .forEach(async (letter) => {
          console.log(`${letter.title} 전송 시작`);
          await sendArmySoldierLetter(
            {
              name: soldier.name,
              birthDate: soldier.birthDate,
              enterDate: soldier.enterDate,
              armyType: '육군',
              armyUnit: soldier.armyUnit,
              soldierType: '예비군인/훈련병',
              relationship: '친구/지인',
            },
            new ArmyLetter(letter.title, letter.body),
          );
          letter.sended = true;
          await letter.save();
          console.log(`${letter.title} 전송 끝`);
        });
      console.log(`${soldier.name} 편지 전송 끝`);
    });

    // TODO: 공군 전송 기능
    let airForceSoldier = await AirForceSoldier.find({ corona: true }).populate('letters').exec();

    airForceSoldier.forEach(async (soldier) => {});

    console.log('편지 전송 끝');
  } catch (error) {
    console.error(error);
  }
}
