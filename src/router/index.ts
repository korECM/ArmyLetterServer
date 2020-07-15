import { Request, Response, Application } from 'express';
import { createAirSoldier, createAirSoldierValidator } from '../controllers/MainController';

export class Routes {
  public routes(app: Application): void {
    app.route('/main/air').post(createAirSoldierValidator, createAirSoldier);

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'main routes1',
      });
    });
  }
}
