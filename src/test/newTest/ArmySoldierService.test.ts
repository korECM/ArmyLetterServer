import sinon from 'sinon';
import * as faker from 'faker/locale/ko';
import { SoldierService } from '../../services/Soldier/SoldierService';
import { ArmySoldierService } from '../../services/Soldier/ArmySoldierService';
import { ArmySoldierDB } from '../../models/ArmySoldier';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';
import { ArmyUnitTypeName } from '../../module/MIL/Models';

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

  describe('createDBSoldier', () => {
    it('모든 인자가 정상적으로 전달되면 해당 모델을 생성한다', async () => {
      // Arrange
      let armyDB = new ArmySoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new ArmySoldierService(armyStub, milStub);

      let birthDate = dateToString(faker.date.between(new Date('1999/01/01'), new Date('2001/12/31')));
      let enterDate = dateToString(faker.date.recent());
      let endDate = dateToString(faker.date.recent());
      let name = `${faker.name.lastName()}${faker.name.firstName()}`;
      let armyUnit: ArmyUnitTypeName = '육군훈련소-논산';
      let trainUnitEdNm = '1교육대 4중대';

      milStub.getSoldier.returns({ birthDate, enterDate, name, trainUnitCdName: armyUnit, trainUnitEdNm, endDate });

      // Act
      let result = await controller.createDBSoldier({
        name,
        armyType: '육군',
        birthDate,
        enterDate,
        armyUnit,
        relationship: '친구/지인',
        soldierType: '예비군인/훈련병',
      });

      // Assert
      expect(
        armyStub.create.calledWithMatch({
          birthDate,
          enterDate,
          endDate,
          name,
          trainUnitEdNm,
          armyUnit: armyUnit,
          letters: [],
        }),
      ).toBe(true);

      expect(result).not.toBeNull();
    });

    it('전달한 군인이 존재하지 않으면 null을 반환한다', async () => {
      // Arrange
      let armyDB = new ArmySoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new ArmySoldierService(armyStub, milStub);

      let birthDate = dateToString(faker.date.between(new Date('1999/01/01'), new Date('2001/12/31')));
      let enterDate = dateToString(faker.date.recent());
      let endDate = dateToString(faker.date.recent());
      let name = `${faker.name.lastName()}${faker.name.firstName()}`;
      let armyUnit: ArmyUnitTypeName = '육군훈련소-논산';
      let trainUnitEdNm = '1교육대 4중대';

      milStub.getSoldier.returns(null);

      // Act
      let result = await controller.createDBSoldier({
        name,
        armyType: '육군',
        birthDate,
        enterDate,
        armyUnit,
        relationship: '친구/지인',
        soldierType: '예비군인/훈련병',
      });

      // Assert
      expect(result).toBeNull();
      expect(armyStub.create.notCalled).toBe(true);
    });
  });
});

function dateToString(date: Date) {
  return date.toISOString().slice(0, 10);
}
