import request from 'supertest';
import { app } from '../../index';

describe('SoldierRouter Test', () => {
  describe('/soldier/id?type=army', () => {
    it('body에 적절한 내용 없으면 406 반환', async (done) => {
      // TODO: 각 항목 별로 테스트

      const response = await request(app).get('/soldier/1234?type=army').send();
      expect(response.status).toEqual(406);

      done();
    });

    it('적절한 데이터가 주어져 군인을 찾는데 성공한다면 200 반환', async (done) => {
      const response = await request(app).get('/soldier/5f146ae09113064a9f7ed941?type=army').send();
      expect(response.status).toEqual(200);

      done();
    });
  });

  describe('/soldier/id?type=airForce', () => {
    it('body에 적절한 내용 없으면 406 반환', async (done) => {
      // TODO: 각 항목 별로 테스트

      const response = await request(app).get('/soldier/1234?type=airForce').send();
      expect(response.status).toEqual(406);

      done();
    });

    it('적절한 데이터가 주어져 군인을 찾는데 성공한다면 200 반환', async (done) => {
      const response = await request(app).get('/soldier/5f145c849c9a485684030673?type=airForce').send();
      expect(response.status).toEqual(200);

      done();
    });
  });
});
