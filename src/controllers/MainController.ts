import { Request, Response, NextFunction } from 'express';

export function createAirSoldier(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);

  res.send('Hello');
}
