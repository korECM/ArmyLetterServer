import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { findArmySoldier, findAirForceSoldier } from '../services/FindSoldier';
import { ArmySoldierInterface, ArmySoldier } from '../module/MIL/Models/Army';
import { AirForceSoldierInterface, AirForceSoldier } from '../module/MIL/Models';
import ArmySoldierModel from '../models/ArmySoldier';
import AirForceSoldierModel from '../models/AirForceSoldier';

export let createArmySoldierValidator = [
  body('name').notEmpty(),
  body('armyType').notEmpty(),
  body('armyUnit').notEmpty(),
  body('birthDate').isDate(),
  body('enterDate').isDate(),
];

export async function createArmySoldierProxy(req: Request, res: Response, next: NextFunction) {
  const soldier = await createArmySoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}

export async function createArmySoldier(soldier: ArmySoldierInterface) {
  const soldierFromArmy = await findArmySoldier(soldier);
  if (soldierFromArmy) {
    const { name, birthDate, enterDate, endDate, trainUnitCdName: armyUnit, trainUnitEdNm } = soldierFromArmy as ArmySoldier;

    let exSoldier = await ArmySoldierModel.findOne({ name, birthDate, enterDate, armyUnit, trainUnitEdNm, endDate });
    if (exSoldier) return exSoldier;

    let dbSoldier = new ArmySoldierModel({
      name,
      birthDate,
      enterDate,
      armyUnit,
      trainUnitEdNm,
      endDate,
    });
    await dbSoldier.save();
    return dbSoldier;
  }

  return null;
}

export let createAirSoldierValidator = [body('name').notEmpty(), body('birthDate').notEmpty().isLength({ max: 8, min: 8 })];

export async function createAirSoldierProxy(req: Request, res: Response, next: NextFunction) {
  const soldier = await createAirSoldier(req.body);

  if (soldier == null) return res.status(404).send();

  return res.status(201).json(soldier);
}

export async function createAirSoldier(soldier: AirForceSoldierInterface) {
  const soldierFromAirForce = await findAirForceSoldier(soldier);

  if (soldierFromAirForce) {
    const { name, birthDate: birthDateRaw, enterDate, endDate, imageURL: image, soldierInfo: trainUnitEdNm } = soldierFromAirForce as AirForceSoldier;
    let birthDate = [birthDateRaw.substring(0, 4), birthDateRaw.substring(4, 6), birthDateRaw.substring(6)].join('-');
    let exSoldier = await AirForceSoldierModel.findOne({ name, birthDate, enterDate, trainUnitEdNm, endDate, image });
    if (exSoldier) return exSoldier;

    let dbSoldier = new AirForceSoldierModel({
      name,
      birthDate,
      enterDate,
      trainUnitEdNm,
      endDate,
      image,
    });
    await dbSoldier.save();
    return dbSoldier;
  }

  return soldierFromAirForce;
}
