import sinon from 'sinon';
import { SoldierService } from '../../services/Soldier/SoldierService';
import { ArmySoldierService } from '../../services/Soldier/ArmySoldierService';
import { ArmySoldierDB } from '../../models/ArmySoldier';

describe('ArmySoldierService', () => {
  describe('getDBSoldierById', () => {
    it('id가 주어지면 ArmySoldierDBModel에 요청한다', async (done) => {
      let armyDB = new ArmySoldierDB();
      let stub = sinon.stub(armyDB);
      let controller = new ArmySoldierService(stub);

      await controller.getDBSoldierById('5f146ae09113064a9f7ed941');

      expect(stub.findByID.calledOnceWith('5f146ae09113064a9f7ed941')).toBe(true);

      done();
    });

    it('만약 id가 주어지지 않거나 올바른 ObjectID가 아니라면 null을 반환한다', async (done) => {
      let armyDB = new ArmySoldierDB();
      let stub = sinon.stub(armyDB);
      let controller = new ArmySoldierService(stub);

      await controller.getDBSoldierById('');
      await controller.getDBSoldierById('123456');

      expect(stub.findByID.callCount).toBe(0);

      done();
    });
  });


});
