import Letter, { LetterSchemaInterface } from '../models/Letter';
import ArmySoldier from '../models/ArmySoldier';
import AirForceSoldier from '../models/AirForceSoldier';
import { findArmySoldier } from './FindSoldier';
import {
  ArmyLetter,
  ArmySoldierInterface,
  ArmySoldier as ArmySoldierMIL,
  AirForceSoldierInterface,
  AirForceLetter,
  AirForceSoldier as AirForceSoldierMIL,
} from '../module/MIL/Models';
import { MilitaryLetter } from '../module/MIL/Service/MilitaryLetter';

export async function sendLetterInDBToSoldiers() {
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
            '인편 대행 서비스',
          );
          letter.sended = true;
          await letter.save();
          console.log(`${letter.title} 전송 끝`);
        });
      console.log(`${soldier.name} 편지 전송 끝`);
    });

    // TODO: 공군 전송 기능
    let airForceSoldier = await AirForceSoldier.find({ corona: true }).populate('letters').exec();

    airForceSoldier.forEach(async (soldier) => {
      console.log(`${soldier.name} 편지 전송 시작`);
      (soldier.letters as LetterSchemaInterface[])
        .filter((letter) => letter.sended === false)
        .forEach(async (letter) => {
          console.log(`${letter.title} 전송 시작`);
          await sendAirForceSoldierLetter(soldier, {
            addr1: '',
            addr2: '',
            body: letter.body,
            relationship: '인편 대행',
            senderName: '인편 대행 서비스',
            password: 'ArmyLetterService',
            title: letter.title,
            zipCode: '',
          });
          letter.sended = true;
          await letter.save();
          console.log(`${letter.title} 전송 끝`);
        });
      console.log(`${soldier.name} 편지 전송 끝`);
    });

    console.log('편지 전송 끝');
  } catch (error) {
    console.error(error);
  }
}

export async function sendArmySoldierLetter(soldier: ArmySoldierInterface, letter: ArmyLetter, nickName: string) {
  const ml = new MilitaryLetter();
  try {
    await ml.config(process.env.ID!, process.env.PW!);

    let targetSoldier: ArmySoldierMIL = new ArmySoldierMIL({
      ...soldier,
      relationship: '친구/지인',
      soldierType: '예비군인/훈련병',
    });

    await ml.updateNickname(nickName);

    await ml.setSoldier(targetSoldier);

    await ml.sendLetter(letter);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function sendAirForceSoldierLetter(soldier: AirForceSoldierInterface, letter: AirForceLetter) {
  const ml = new MilitaryLetter();
  try {
    let targetSoldier: AirForceSoldierMIL = new AirForceSoldierMIL({
      ...soldier,
      birthDate: soldier.birthDate.replace(/-/g, ''),
    });

    await ml.setSoldier(targetSoldier);

    await ml.sendLetter(letter);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function sendLetterToSoldier(soldierID: string, soldierType: string, letter: ArmyLetter | AirForceLetter, nickName: string = '인편 대행 서비스') {
  switch (soldierType) {
    case 'army':
      let armySoldier = await ArmySoldier.findOne({ _id: soldierID }).exec();
      if (!armySoldier) return;
      await sendArmySoldierLetter(
        {
          armyType: '육군',
          armyUnit: armySoldier.armyUnit,
          birthDate: armySoldier.birthDate,
          enterDate: armySoldier.enterDate,
          name: armySoldier.name,
          relationship: '친구/지인',
          soldierType: '예비군인/훈련병',
        },
        letter,
        nickName,
      );
      break;
    case 'airForce':
      let airForceSoldier = await AirForceSoldier.findOne({ _id: soldierID }).exec();
      if (!airForceSoldier) return;
      await sendAirForceSoldierLetter(airForceSoldier, letter as AirForceLetter);
      break;
    default:
      break;
  }
}
