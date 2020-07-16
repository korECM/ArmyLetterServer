import request from 'supertest';
import { app } from '../index';

describe('Server Open Test', () => {
  it('/ GET 요청에 대한 응답은 200 코드를 반환한다', async (done) => {
    request(app).get('/').expect(200);
    done();
  });
});
