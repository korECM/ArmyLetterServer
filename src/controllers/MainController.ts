import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { findArmySoldier } from '../services/FindSoldier';
import { ArmySoldierInterface } from '../module/Models/Army';

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

  return res.status(201).json(soldier);
}

export async function createArmySoldier(soldier: ArmySoldierInterface) {
  const soldierFromArmy = await findArmySoldier(soldier);

  return soldierFromArmy;
}
