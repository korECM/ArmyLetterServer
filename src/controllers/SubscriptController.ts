import { Request, Response, NextFunction } from 'express';
import { param, query, body } from 'express-validator';
import { Types } from 'mongoose';
import { findArmySoldier, findAirForceSoldier } from '../services/FindSoldier';
import { ArmySoldierInterface, ArmySoldier } from '../module/MIL/Models/Army';
import { AirForceSoldierInterface, AirForceSoldier } from '../module/MIL/Models';
import ArmySoldierModel from '../models/ArmySoldier';
import AirForceSoldierModel from '../models/AirForceSoldier';
import { getAirForceSoldier, getArmySoldier } from '../services/GetSoldierFromDB';

let { ObjectId } = Types;

export let postSubValidator = [param('id').notEmpty(), query('type').notEmpty().isIn(['airForce', 'army']), body('sports').isArray()];

export async function postSubscriptionProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  await postSubscription(req.params.id!, req.query.type as string);

  return res.status(200).send();
}

export async function postSubscription(soldierID: string, soldierType: string) {
  let soldier: AirForceSoldierInterface | ArmySoldierInterface | null;
  switch (soldierType) {
    case 'airForce':
      soldier = await getAirForceSoldier(soldierID);
      break;
    case 'army':
      soldier = await getArmySoldier(soldierID);
      break;
    default:
      return null;
  }
  if (soldier === null) return null;
}
