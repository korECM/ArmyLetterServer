import request from 'supertest';
import { app } from '../../index';

describe('SoldierRouter Test', () => {
  describe('/subscript/id?type=army', () => {
    it('body에 적절한 내용 없으면 400 반환', async (done) => {
      // TODO: 각 항목 별로 테스트

      const response = await request(app).post('/subscript/5f10a790cf4c596dc45a659b?type=army').send();
      expect(response.status).toEqual(400);

      done();
    });
    it('적절한 ObjectID가 아니거나 군인이 존재하지 않으면 406 반환', async (done) => {
      const response = await request(app).post('/subscript/1234?type=army').send({
        sports: [],
      });
      expect(response.status).toEqual(406);

      done();
    });

    it('적절한 데이터가 주어져 군인을 찾는데 성공한다면 200 반환', async (done) => {
      const response = await request(app).post('/subscript/5f10a790cf4c596dc45a659b?type=army').send({
        sports: [],
      });
      expect(response.status).toEqual(200);

      done();
    });
  });

  describe('/subscript/id?type=airForce', () => {
    it('body에 적절한 내용 없으면 400 반환', async (done) => {
      // TODO: 각 항목 별로 테스트

      const response = await request(app).post('/subscript/5f10af798945fa01127412d6?type=airForce').send();
      expect(response.status).toEqual(400);

      done();
    });
    it('적절한 ObjectID가 아니거나 군인이 존재하지 않으면 406 반환', async (done) => {
      const response = await request(app).post('/subscript/1234?type=airForce').send({
        sports: [],
      });
      expect(response.status).toEqual(406);

      done();
    });

    it('적절한 데이터가 주어져 군인을 찾는데 성공한다면 200 반환', async (done) => {
      const response = await request(app).post('/subscript/5f10af798945fa01127412d6?type=airForce').send({
        sports: [],
      });
      expect(response.status).toEqual(200);

      done();
    });
  });
});
