import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

let createAirSoldierValidator = [body('name').notEmpty()];

export function createAirSoldier(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(400).send();
  }

  res.send('Hello');
}

export { createAirSoldierValidator };
