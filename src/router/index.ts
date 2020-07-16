import { Request, Response, Application } from 'express';
import { createArmySoldierValidator, createArmySoldierProxy, createAirSoldierProxy, createAirSoldierValidator } from '../controllers/MainController';

export class Routes {
  public routes(app: Application): void {
    app.route('/main/army').post(createArmySoldierValidator, createArmySoldierProxy);

    app.route('/main/air').post(createAirSoldierValidator, createAirSoldierProxy);

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'main routes1',
      });
    });
  }
}
