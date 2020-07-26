import sinon from 'sinon';
import * as faker from 'faker/locale/ko';
import { SubscriptionRequestInterface } from '../../services/Soldier/AbstractSoldierService';
import { MilitaryLetter } from '../../module/MIL/Service/MilitaryLetter';
import { AirForceSchemaColumnsInterface, AirForceSoldierDB } from '../../models/AirForceSoldier';
import { AirForceSoldierService } from '../../services/Soldier/AirForceSolderService';

let armySchemaTest: AirForceSchemaColumnsInterface = {
  birthDate: '2000-02-20',
  corona: true,
  endDate: '',
  enterDate: '2020-02-20',
  letters: [],
  name: '',
  news: [],
  registerDate: new Date(),
  sports: null,
  trainUnitEdNm: '',
  image: '',
};

let subscriptionTest: SubscriptionRequestInterface = {
  news: [],
  sports: { esports: [], koreaBaseball: [], koreaBasketball: [], koreaSoccer: [], worldBaseball: [], worldBasketball: [], worldSoccer: [] },
};

const VALID_OBJECT_ID = '5f146ae09113064a9f7ed941';
const INVALID_OBJECT_ID = '123';
const BLANK_OBJECT_ID = '';

describe('AirForceSoldierService', () => {
  describe('getDBSoldierById', () => {
    it('id가 주어지면 AirForceSoldierDBModel에 요청한다', async (done) => {
      let armyDB = new AirForceSoldierDB();
      let stub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(stub);

      await controller.getDBSoldierById(VALID_OBJECT_ID);

      expect(stub.findByID.calledOnceWith(VALID_OBJECT_ID)).toBe(true);

      done();
    });

    it('만약 id가 주어지지 않거나 올바른 ObjectID가 아니라면 null을 반환한다', async (done) => {
      let armyDB = new AirForceSoldierDB();
      let stub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(stub);

      await controller.getDBSoldierById(BLANK_OBJECT_ID);
      await controller.getDBSoldierById('123456');

      expect(stub.findByID.callCount).toBe(0);

      done();
    });
  });

  describe('createDBSoldier', () => {
    it('모든 인자가 정상적으로 전달되면 해당 모델을 생성한다', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      let birthDate = dateToString(faker.date.between(new Date('1999/01/01'), new Date('2001/12/31')));
      let enterDate = dateToString(faker.date.recent());
      let endDate = dateToString(faker.date.recent());
      let name = `${faker.name.lastName()}${faker.name.firstName()}`;
      let traineeNum = '1교육대 4중대';
      let imageURL = 'https://www.naver.com';

      milStub.getSoldier.returns({ birthDate, enterDate, name, endDate, imageURL, traineeNum });

      // Act
      let result = await controller.createDBSoldier({
        name,
        birthDate,
        enterDate,
        endDate,
        imageURL,
        soldierInfo: '군인 정보',
        traineeNum,
      });

      // Assert
      expect(
        armyStub.create.calledWithMatch({
          birthDate,
          enterDate,
          endDate,
          name,
          image: imageURL,
          trainUnitEdNm: traineeNum,
          letters: [],
        }),
      ).toBe(true);

      expect(result).not.toBeNull();
    });

    it('전달한 군인이 존재하지 않으면 null을 반환한다', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      let birthDate = dateToString(faker.date.between(new Date('1999/01/01'), new Date('2001/12/31')));
      let enterDate = dateToString(faker.date.recent());
      let endDate = dateToString(faker.date.recent());
      let name = `${faker.name.lastName()}${faker.name.firstName()}`;
      let traineeNum = '1교육대 4중대';

      milStub.getSoldier.returns(null);

      // Act
      let result = await controller.createDBSoldier({
        name,
        birthDate,
        enterDate,
        endDate,
        imageURL: 'imageLink',
        soldierInfo: '군인 정보',
        traineeNum,
      });

      // Assert
      expect(result).toBeNull();
      expect(armyStub.create.notCalled).toBe(true);
    });
  });

  describe('getMILSoldierByDBSoldier', () => {
    it('DBId가 주어지고 유효한 id가 아니라면 null 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      // Act
      let result = await controller.getMILSoldierByDBSoldier(INVALID_OBJECT_ID);

      // Assert
      expect(armyStub.findByID.notCalled).toBe(true);
      expect(result).toBeNull();
    });

    it('DBId가 빈 문자여로 주어지면 null 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      // Act
      let result = await controller.getMILSoldierByDBSoldier(BLANK_OBJECT_ID);

      // Assert
      expect(armyStub.findByID.notCalled).toBe(true);
      expect(result).toBeNull();
    });

    it('적절한 id가 주어지면 MILSoldier 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      armyStub.findByID.resolves(armySchemaTest);

      // Act
      let result = await controller.getMILSoldierByDBSoldier(VALID_OBJECT_ID);

      // Assert
      expect(armyStub.findByID.called).toBe(true);
      expect(result).not.toBeNull();
    });

    it('DB로부터 군인을 구해서 전달했을 때 MILSoldier 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      // Act
      let result = await controller.getMILSoldierByDBSoldier(armySchemaTest);

      // Assert
      expect(result).not.toBeNull();
    });
  });

  describe('checkMILSoldierExistInSiteByDBSoldier', () => {
    it('군인이 사이트에 존재하면 true 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      let birthDate = dateToString(faker.date.between(new Date('1999/01/01'), new Date('2001/12/31')));
      let enterDate = dateToString(faker.date.recent());
      let endDate = dateToString(faker.date.recent());
      let name = `${faker.name.lastName()}${faker.name.firstName()}`;
      let traineeNum = '1교육대 4중대';

      milStub.getSoldier.returns({ birthDate, enterDate, name, endDate });

      // Act
      let result = await controller.checkMILSoldierExistInSiteByDBSoldier(armySchemaTest);

      // Assert
      expect(result).toBe(true);
    });

    it('군인이 사이트에 존재하지 않으면 false 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      milStub.getSoldier.returns(null);

      // Act
      let result = await controller.checkMILSoldierExistInSiteByDBSoldier(armySchemaTest);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('sendLetter', () => {
    it('id가 주어지지 않으면 false 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);
      // Act
      let result = await controller.sendLetter(BLANK_OBJECT_ID, {
        title: '제목',
        body: '내용',
        senderName: '보낸이',
        password: '비밀번호',
        relationship: '관계',
        addr1: '',
        addr2: '',
        zipCode: '',
      });

      // Assert
      expect(result).toBe(false);
    });

    it('Object id가 주어지지 않으면 false 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);
      // Act
      let result = await controller.sendLetter(BLANK_OBJECT_ID, {
        title: '제목',
        body: '내용',
        senderName: '보낸이',
        password: '비밀번호',
        relationship: '관계',
        addr1: '',
        addr2: '',
        zipCode: '',
      });

      // Assert
      expect(result).toBe(false);
    });

    it('sender 이름이 없는 경우 인편 대행 서비스로 이름 설정', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      armyStub.findByID.resolves(armySchemaTest);

      // Act
      let result = await controller.sendLetter(BLANK_OBJECT_ID, {
        title: '제목',
        body: '내용',
        senderName: '',
        password: '비밀번호',
        relationship: '관계',
        addr1: '',
        addr2: '',
        zipCode: '',
      });

      // Assert
      expect(result).toBe(true);
      expect(milStub.updateNickname.lastCall.calledWith('인편 대행 서비스')).toBe(true);
    });

    it('sender 이름이 이미 존재하는 경우 인편 대행 서비스로 이름 설정', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      armyStub.findByID.resolves(armySchemaTest);
      milStub.updateNickname.resolves(false);

      // Act
      let result = await controller.sendLetter(BLANK_OBJECT_ID, {
        title: '제목',
        body: '내용',
        senderName: '중복되는 이름',
        password: '비밀번호',
        relationship: '관계',
        addr1: '',
        addr2: '',
        zipCode: '',
      });

      // Assert
      expect(result).toBe(true);
      expect(milStub.updateNickname.lastCall.calledWith('인편 대행 서비스')).toBe(true);
    });

    it('전달된 편지 제목, 내용으로 sendLetter 호출', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let mil = new MilitaryLetter();
      let milStub = sinon.stub(mil);
      let controller = new AirForceSoldierService(armyStub, milStub);

      armyStub.findByID.resolves(armySchemaTest);
      milStub.updateNickname.resolves(false);

      // Act
      let result = await controller.sendLetter(BLANK_OBJECT_ID, {
        title: '제목',
        body: '내용',
        senderName: '보낸이',
        password: '비밀번호',
        relationship: '관계',
        addr1: '',
        addr2: '',
        zipCode: '',
      });

      // Assert
      expect(result).toBe(true);
      expect((milStub.sendLetter.args[0][0] as any).title).toBe('제목');
      expect((milStub.sendLetter.args[0][0] as any).body).toBe('내용');
    });
  });

  describe('updateSubscription', () => {
    it('빈 id가 주어지면 false 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      armyStub.saveSubscription.resolves(true);

      // Act
      let result = await controller.updateSubscription(BLANK_OBJECT_ID, subscriptionTest);

      // Assert
      expect(result).toBe(false);
    });

    it('적절하지 않은 id가 주어지면 false 반환', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      armyStub.saveSubscription.resolves(true);

      // Act
      let result = await controller.updateSubscription(INVALID_OBJECT_ID, subscriptionTest);

      // Assert
      expect(result).toBe(false);
    });

    it('적절한 id가 주어지면 saveSubscription 호출', async () => {
      // Arrange
      let armyDB = new AirForceSoldierDB();
      let armyStub = sinon.stub(armyDB);
      let controller = new AirForceSoldierService(armyStub);

      armyStub.saveSubscription.resolves(true);

      // Act
      let result = await controller.updateSubscription(VALID_OBJECT_ID, subscriptionTest);

      // Assert
      expect(result).toBe(true);
      expect(armyStub.saveSubscription.calledOnceWith(VALID_OBJECT_ID, subscriptionTest));
    });
  });
});

function dateToString(date: Date) {
  return date.toISOString().slice(0, 10);
}
