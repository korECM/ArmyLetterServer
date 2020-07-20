import { Request, Response, NextFunction } from 'express';
import { param, query } from 'express-validator';
import { Types } from 'mongoose';
import { getAirForceSoldierWithLetters, getArmySoldierWithLetters } from '../services/GetSoldierFromDB';

let { ObjectId } = Types;

export let getSoldierValidator = [param('id').notEmpty(), query('type').notEmpty().isIn(['airForce', 'army'])];

export async function getSoldierProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  const soldier = await getSoldier(req.params.id!, req.query.type as string);
  console.log(soldier);
  if (!soldier) return res.status(406).send();

  return res.status(200).json(soldier);
}

export async function getSoldier(soldierID: string, soldierType: string) {
  switch (soldierType) {
    case 'airForce':
      return await getAirForceSoldierWithLetters(soldierID);
    case 'army':
      return await getArmySoldierWithLetters(soldierID);
    default:
      return null;
  }

  return null;
}
