import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
export function rejectInvalidForm(status: number = 400) {
  return function (req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(400).send();
    }
    next();
  };
}
