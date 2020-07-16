import { Request, Response, Application } from 'express';
import { createArmySoldier, createArmySoldierValidator } from '../controllers/MainController';

export class Routes {
  public routes(app: Application): void {
    app.route('/main/army').post(createArmySoldierValidator, createArmySoldier);

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'main routes1',
      });
    });
  }
}
