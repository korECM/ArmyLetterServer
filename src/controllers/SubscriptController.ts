import { Request, Response, NextFunction } from 'express';
import { param, query, body } from 'express-validator';
import { Types } from 'mongoose';
import { findArmySoldier, findAirForceSoldier } from '../services/FindSoldier';
import { ArmySoldierInterface, ArmySoldier } from '../module/MIL/Models/Army';
import ArmySoldierModel, { ArmySoldierSchemaInterface } from '../models/ArmySoldier';
import AirForceSoldierModel, { AirForceSchemaInterface } from '../models/AirForceSoldier';
import { getAirForceSoldier, getArmySoldier, getAirForceSoldierWithSports, getArmySoldierWithSports } from '../services/GetSoldierFromDB';
import Sports, { SportsSchemaInterface } from '../models/Sports';
import { saveSoldier } from '../services/SaveSoldier';

let { ObjectId } = Types;

export interface SubscriptionRequestInterface {
  sports: {
    koreaBaseball: string[];
    koreaBasketball: string[];
    koreaSoccer: string[];
    worldBaseball: string[];
    worldBasketball: string[];
    worldSoccer: string[];
    esports: string[];
  };
}

export let postSubValidator = [param('id').notEmpty(), query('type').notEmpty().isIn(['airForce', 'army']), body('sports').notEmpty()];

export async function postSubscriptionProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  await postSubscription(req.params.id!, req.query.type as string, req.body);

  return res.status(200).send();
}

export async function postSubscription(soldierID: string, soldierType: string, subscription: SubscriptionRequestInterface) {
  let soldier: AirForceSchemaInterface | ArmySoldierSchemaInterface | null = await requestFindSoldier(soldierID, soldierType);

  if (soldier === null) return null;

  console.log(soldier);

  await updateSportsInformation(soldier, subscription);

  await saveSoldier(soldier, soldierType);
}

export async function updateSportsInformation(soldier: AirForceSchemaInterface | ArmySoldierSchemaInterface, subscription: SubscriptionRequestInterface) {
  let sports: SportsSchemaInterface | null;

  // undefined or null
  if (!soldier.sports) {
    sports = new Sports();
    soldier.sports = sports._id;
  } else {
    sports = soldier.sports;
  }

  const { koreaBaseball, koreaBasketball, koreaSoccer, worldBaseball, worldBasketball, worldSoccer, esports } = subscription.sports;

  sports.koreaBaseball = koreaBaseball;
  sports.koreaBasketball = koreaBasketball;
  sports.koreaSoccer = koreaSoccer;
  sports.worldBaseball = worldBaseball;
  sports.worldBasketball = worldBasketball;
  sports.worldSoccer = worldSoccer;
  sports.esports = esports;

  await sports.save();
}

async function requestFindSoldier(soldierID: string, soldierType: string) {
  switch (soldierType) {
    case 'airForce':
      return await getAirForceSoldierWithSports(soldierID);
    case 'army':
      return await getArmySoldierWithSports(soldierID);
    default:
      return null;
  }
}
