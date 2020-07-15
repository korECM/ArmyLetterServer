import express from 'express';
import session from 'express-session';
import { Routes } from './router';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { MyError } from './types';

class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    dotenv.config();

    this.app = express();
    this.config();
    this.routes.routes(this.app);
    this.errorHandler();
  }

  private config() {
    this.app.set('port', process.env.PORT || 8001);

    this.app.use(morgan('dev'));

    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: false,
      }),
    );

    this.app.use(cookieParser(process.env.COOKIE_SECRET));

    const sessionOption: session.SessionOptions = {
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET!,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    };

    this.app.use(session(sessionOption));
  }

  private errorHandler(): void {
    this.app.use((req, res, next) => {
      const err = new MyError(404);
      next(err);
    });

    this.app.use((err: MyError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
  }
}

export default new App().app;
