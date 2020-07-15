import { Request, Response, Application } from 'express';
import { createAirSoldier } from '../controllers/MainController';

export class Routes {
  public routes(app: Application): void {
    app.route('/main/air').post(createAirSoldier);

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'main routes1',
      });
    });
  }
}
