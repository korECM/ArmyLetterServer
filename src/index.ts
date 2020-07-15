import app from './app';
import { createServer } from 'http';

(async () => {
  createServer(app).listen(app.get('port'), () => {
    console.log(`서버 Port : ${app.get('port')}에서 시작`);
  });
})();

export { app };
