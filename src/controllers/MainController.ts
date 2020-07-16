import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { findArmySoldier, findAirForceSoldier } from '../services/FindSoldier';
import { ArmySoldierInterface } from '../module/Models/Army';
import { AirForceSoldierInterface } from '../module/Models';

export let createArmySoldierValidator = [
  body('name').notEmpty(),
  body('armyType').notEmpty(),
  body('armyUnit').notEmpty(),
  body('birthDate').isDate(),
  body('enterDate').isDate(),
];

export async function createArmySoldierProxy(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send();
  }

  const soldier = await createArmySoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}

export async function createArmySoldier(soldier: ArmySoldierInterface) {
  const soldierFromArmy = await findArmySoldier(soldier);

  return soldierFromArmy;
}

export let createAirSoldierValidator = [body('name').notEmpty(), body('birthDate').notEmpty().isLength({ max: 8, min: 8 })];

export async function createAirSoldierProxy(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send();
  }

  const soldier = await createAirSoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}

export async function createAirSoldier(soldier: AirForceSoldierInterface) {
  const soldierFromAirForce = await findAirForceSoldier(soldier);
  return soldierFromAirForce;
}
