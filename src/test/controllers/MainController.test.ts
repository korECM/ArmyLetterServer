import { createArmySoldier } from '../../controllers/MainController';
import dotenv from 'dotenv';

dotenv.config();

describe('MainController', () => {
  describe('createArmySoldier()는', () => {
    it('정확한 군인 정보가 들어오면 DB에 해당 군인을 저장한다', async (done) => {
      done();
    });

    it('일치하는 군인이 없으면 null을 반환한다', async (done) => {
      const soldier = await createArmySoldier({
        armyType: '육군',
        armyUnit: '12사단',
        birthDate: '2022-02-22',
        enterDate: '2020-02-20',
        name: '홍길동',
        relationship: '친구/지인',
        soldierType: '예비군인/훈련병',
      });
      expect(soldier).toBeNull();

      done();
    });
  });
});
