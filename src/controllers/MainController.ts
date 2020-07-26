import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { ArmySoldierService } from '../services/Soldier/ArmySoldierService';
import { AirForceSoldierService } from '../services/Soldier/AirForceSolderService';

export let createArmySoldierValidator = [
  body('name').notEmpty(),
  body('armyType').notEmpty(),
  body('armyUnit').notEmpty(),
  body('birthDate').isDate(),
  body('enterDate').isDate(),
];

export async function createArmySoldierProxy(req: Request, res: Response, next: NextFunction) {
  let soldierController = new ArmySoldierService();
  let existSoldier = await soldierController.findSoldier(req.body.name, req.body.birthDate);
  if (existSoldier) {
    return res.status(201).json(existSoldier);
  }

  const soldier = await soldierController.createDBSoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}

export let createAirSoldierValidator = [body('name').notEmpty(), body('birthDate').notEmpty().isLength({ max: 10, min: 10 })];

export async function createAirSoldierProxy(req: Request, res: Response, next: NextFunction) {
  let soldierController = new AirForceSoldierService();
  let existSoldier = await soldierController.findSoldier(req.body.name, req.body.birthDate);
  if (existSoldier) {
    return res.status(201).json(existSoldier);
  }
  const soldier = await soldierController.createDBSoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}
