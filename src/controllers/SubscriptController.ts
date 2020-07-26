import { Request, Response, NextFunction } from 'express';
import { param, query, body } from 'express-validator';
import { Types } from 'mongoose';
import { SoldierService } from '../services/Soldier/SoldierService';

let { ObjectId } = Types;

export let postSubValidator = [
  param('id').notEmpty(),
  query('type').notEmpty().isIn(['airForce', 'army']),
  body('sports').notEmpty(),
  body('corona').isBoolean().notEmpty(),
  body('news').notEmpty().toArray().isArray(),
];

export async function postSubscriptionProxy(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params.id!)) return res.status(406).send();

  let controller = SoldierService.getSoldierController(req.query.type as string)!;

  if (await controller.updateSubscription(req.params.id, req.body)) {
    // 업데이트 성공하면
    return res.status(200).send();
  } else {
    // 업데이트 실패하면
    return res.status(406).send();
  }
}
