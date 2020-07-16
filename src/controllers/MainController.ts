import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { findArmySoldier } from '../services/FindSoldier';

let createArmySoldierValidator = [
  body('name').notEmpty(),
  body('armyType').notEmpty(),
  body('armyUnit').notEmpty(),
  body('birthDate').isDate(),
  body('enterDate').isDate(),
];

export async function createArmySoldier(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(400).send();
  }

  await findArmySoldier();

  res.send('Hello');
}

export { createArmySoldierValidator };
