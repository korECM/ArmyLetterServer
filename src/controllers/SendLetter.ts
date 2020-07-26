import { Request, Response, NextFunction } from 'express';
import { param, query, body } from 'express-validator';
import { Types } from 'mongoose';
import { sendAirForceSoldierLetter } from '../services/sendLetter';
import { AirForceLetter } from '../module/MIL/Models';
import { SoldierService } from '../services/Soldier/SoldierService';
import { ArmySoldierService } from '../services/Soldier/ArmySoldierService';
import { ArmySoldierSchemaColumnsInterface } from '../models/ArmySoldier';

let { ObjectId } = Types;

export let sendLetterValidator = [
  param('id').notEmpty(),
  query('type').notEmpty().isIn(['airForce', 'army']),
  body('title').notEmpty(),
  body('body').notEmpty(),
];

export async function sendLetterProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  const soldierController = SoldierService.getSoldierController(req.query.type as string)!;

  const soldier = await soldierController.getDBSoldierById(req.params.id);
  if (!soldier) return res.status(406).send();

  let { title, body, sender, password, relationship } = req.body;

  if (req.query.type === 'airForce') {
    if (!sender || !password || !relationship) return res.status(400).send();
    await sendAirForceSoldierLetter(soldier, new AirForceLetter(title, body, sender, relationship, '', '', '', password));
  } else {
    await (soldierController as ArmySoldierService).sendLetter(soldier as ArmySoldierSchemaColumnsInterface, {
      title,
      body,
      senderName: sender,
      relationship,
      password,
    });
  }

  return res.status(200).json(soldier);
}
