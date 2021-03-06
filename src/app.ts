import express from 'express';
import session from 'express-session';
import { Routes } from './router';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import schedule from 'node-schedule';
import { saveCoronaLetter } from './services/saveCoronaLetter';
import { MyError } from './types';
import { sendLetterInDBToSoldiers } from './services/sendLetter';
import { saveNewsLetter } from './services/SaveNewsLetter';
import { deleteOldLetters } from './services/DeleteOldLetters';

class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    dotenv.config();

    this.app = express();
    this.config();
    this.routes.routes(this.app);
    this.errorHandler();
    this.letterSchedule();
    this.sendLetterSchedule();
    this.deletePreviousLetters();
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

  private deletePreviousLetters() {
    schedule.scheduleJob('0 20 * * *', async () => {
      await deleteOldLetters();
    });

    // deleteOldLetters();
  }

  private sendLetterSchedule() {
    schedule.scheduleJob('0 22 * * *', async () => {
      await sendLetterInDBToSoldiers();
    });
    // schedule.scheduleJob('30 * * * * *', async () => {
    //   await sendLetterInDBToSoldiers();
    // });
  }

  private letterSchedule() {
    schedule.scheduleJob('0 21 * * *', async () => {
      await saveCoronaLetter();
    });

    schedule.scheduleJob('0 21 * * *', async () => {
      await saveNewsLetter();
    });

    // schedule.scheduleJob('0 * * * * *', async () => {
    //   await saveNewsLetter();
    // });

    // schedule.scheduleJob('0 * * * * *', async () => {
    //   await saveCoronaLetter();
    // });
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
