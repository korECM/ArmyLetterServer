import { Request, Response, Application } from 'express';
import { createArmySoldierValidator, createArmySoldierProxy, createAirSoldierProxy, createAirSoldierValidator } from '../controllers/MainController';
import { rejectInvalidForm } from '../util/route';
import { getSoldierValidator, getSoldierProxy } from '../controllers/SoldierController';
import { postSubValidator, postSubscriptionProxy } from '../controllers/SubscriptController';

export class Routes {
  public routes(app: Application): void {
    app.route('/main/army').post(createArmySoldierValidator, rejectInvalidForm(), createArmySoldierProxy);

    app.route('/main/air').post(createAirSoldierValidator, rejectInvalidForm(), createAirSoldierProxy);

    app.route('/soldier/:id').get(getSoldierValidator, rejectInvalidForm(), getSoldierProxy);

    app.route('/subscript/:id').post(postSubValidator, rejectInvalidForm(), postSubscriptionProxy);

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'main routes1',
      });
    });
  }
}
