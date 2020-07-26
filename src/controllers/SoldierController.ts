import { Request, Response, NextFunction } from 'express';
import { param, query } from 'express-validator';
import { Types } from 'mongoose';
import { SoldierService } from '../services/Soldier/SoldierService';

let { ObjectId } = Types;

export let getSoldierValidator = [param('id').notEmpty(), query('type').notEmpty().isIn(['airForce', 'army'])];

export async function getSoldierProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  let controller = SoldierService.getSoldierController(req.query.type as string);
  if (!controller) return res.status(406).send();

  const soldier = await controller.getDBSoldierById(req.params.id, 'letters');

  if (!soldier) return res.status(406).send();

  return res.status(200).json(soldier);
}
