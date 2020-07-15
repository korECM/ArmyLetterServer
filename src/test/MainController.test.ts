import request from 'supertest';
import { app } from '../index';

describe('MainController Test', () => {
  describe('createAirSoldier', () => {
    it('body에 적절한 내용 없으면 400 반환', async (done) => {
      const response = await request(app).post('/main/air').send({});

      expect(response.status).toEqual(400);

      done();
    });
  });
});
