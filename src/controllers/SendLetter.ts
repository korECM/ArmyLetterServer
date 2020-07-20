import { Request, Response, NextFunction } from 'express';
import { param, query, body } from 'express-validator';
import { Types } from 'mongoose';
import { getAirForceSoldier, getArmySoldier } from '../services/GetSoldierFromDB';
import { sendAirForceSoldierLetter, sendArmySoldierLetter } from '../services/sendLetter';
import { AirForceLetter, ArmyLetter, ArmySoldierInterface } from '../module/MIL/Models';
import { ArmySoldierSchemaInterface } from '../models/ArmySoldier';

let { ObjectId } = Types;

export let sendLetterValidator = [
  param('id').notEmpty(),
  query('type').notEmpty().isIn(['airForce', 'army']),
  body('title').notEmpty(),
  body('body').notEmpty(),
];

export async function sendLetterProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  const soldier = await getSoldier(req.params.id!, req.query.type as string);
  if (!soldier) return res.status(406).send();

  let { title, body, sender, password, relationship } = req.body;

  if (req.query.type === 'airForce') {
    if (!sender || !password || !relationship) return res.status(400).send();
    await sendAirForceSoldierLetter(soldier, new AirForceLetter(title, body, sender, relationship, '', '', '', password));
  } else {
    //TODO: 보내는 사람 이름 설정
    await sendArmySoldierLetter(
      {
        armyType: '육군',
        armyUnit: (soldier as ArmySoldierSchemaInterface).armyUnit,
        birthDate: soldier.birthDate,
        enterDate: soldier.enterDate,
        name: soldier.name,
        relationship: '친구/지인',
        soldierType: '예비군인/훈련병',
      },
      new ArmyLetter(title, body),
      '',
    );
  }

  return res.status(200).json(soldier);
}

export async function getSoldier(soldierID: string, soldierType: string) {
  switch (soldierType) {
    case 'airForce':
      return await getAirForceSoldier(soldierID);
    case 'army':
      return await getArmySoldier(soldierID);
    default:
      return null;
  }

  return null;
}
