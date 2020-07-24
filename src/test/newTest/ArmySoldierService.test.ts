import mongoose from 'mongoose';
import { ArmySoldierService } from '../../services/Soldier/ArmySoldierService';
import { ArmySoldierDBInterface, ArmySoldierSchemaInterface, ArmySoldierSchemaColumnsInterface } from '../../models/ArmySoldier';

class ArmySoldierServiceStub implements ArmySoldierDBInterface {
  findByID(id: string): Promise<ArmySoldierSchemaColumnsInterface | null> {
    return new Promise((resolve, reject) => {
      if (id === 'success') {
        resolve({
          name: '성공',
          birthDate: '',
          enterDate: '',
          armyUnit: '11사단',
          trainUnitEdNm: '',
          endDate: '',
          sports: null,
          news: [],
          letters: [],
          corona: false,
          registerDate: new Date(),
        });
      } else {
        reject(null);
      }
    });
  }
}

describe('ArmySoldierService', () => {
  describe('getSoldier', () => {
    it('군인을 찾으면 그 군인을 반환한다', async (done) => {
      let armySoldierService = new ArmySoldierService(new ArmySoldierServiceStub());

      let spyFn = jest.spyOn(armySoldierService, 'getSoldier');

      let result = await armySoldierService.getSoldier('success');

      expect(spyFn).toBeCalledTimes(1);
      expect(spyFn).lastCalledWith('success');
      expect(result!.name).toBe('성공');

      done();
    });
    it('해당 군인이 존재하지 않으면 null을 반환한다', async (done) => {
      let armySoldierService = new ArmySoldierService(new ArmySoldierServiceStub());

      let spyFn = jest.spyOn(armySoldierService, 'getSoldier');

      let result = await armySoldierService.getSoldier('Fail');

      expect(spyFn).toBeCalledTimes(1);
      expect(spyFn).lastCalledWith('Fail');
      expect(result).toBeNull();

      done();
    });
  });
});
