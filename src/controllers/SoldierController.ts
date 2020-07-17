import { Request, Response, NextFunction } from 'express';
import { param, query, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { findArmySoldier, findAirForceSoldier } from '../services/FindSoldier';
import { ArmySoldierInterface, ArmySoldier } from '../module/MIL/Models/Army';
import { AirForceSoldierInterface, AirForceSoldier } from '../module/MIL/Models';
import ArmySoldierModel from '../models/ArmySoldier';
import AirForceSoldierModel from '../models/AirForceSoldier';

let { ObjectId } = Types;

export let getSoldierValidator = [param('id').notEmpty(), query('type').notEmpty().isIn(['airForce', 'army'])];

export async function getSoldierProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  const soldier = await getSoldier(req.params.id!, req.query.type as string);

  if (!soldier) return res.status(406).send();

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

async function getArmySoldier(soldierID: string) {
  let soldier = await ArmySoldierModel.findOne({ _id: soldierID }).exec();
  return soldier;
}

async function getAirForceSoldier(soldierID: string) {
  let soldier = await AirForceSoldierModel.findOne({ _id: soldierID }).exec();
  return soldier;
}
