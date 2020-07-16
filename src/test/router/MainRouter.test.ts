import request from 'supertest';
import { app } from '../../index';

describe('MainRouter Test', () => {
  describe('createArmySoldierProxy', () => {
    it('body에 적절한 내용 없으면 400 반환', async (done) => {
      // TODO: 각 항목 별로 테스트

      const response = await request(app).post('/main/army').send({});
      expect(response.status).toEqual(400);

      done();
    });

    it('적절한 데이터가 주어져 군인을 찾는데 성공한다면 201 반환', async (done) => {
      const response = await request(app).post('/main/army').send({
        armyType: '육군',
        armyUnit: '육군훈련소-논산',
        enterDate: '2020-06-15',
        birthDate: '1999-10-26',
        name: '김희백',
      });
      expect(response.status).toEqual(201);

      done();
    });
  });
});
