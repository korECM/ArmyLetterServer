import { createArmySoldier } from '../../controllers/MainController';
import dotenv from 'dotenv';
import { getAirForceSoldier, getAirForceSoldierWithSports, getArmySoldierWithSports } from '../../services/GetSoldierFromDB';
import { updateSportsInformation } from '../../controllers/SubscriptController';
import db from '../../DB';
import { AirForceSchemaInterface } from '../../models/AirForceSoldier';
import { ArmySoldierSchemaInterface } from '../../models/ArmySoldier';

dotenv.config();

describe('SubscriptionController', () => {
  beforeEach(async () => {
    await db.connect();
  });
  describe('updateSportsInformation()는', () => {
    it('sports 정보를 soldier에 저장한다', async (done) => {
      let soldier: AirForceSchemaInterface | ArmySoldierSchemaInterface | null = await getAirForceSoldierWithSports('5f10af798945fa01127412d6');

      await updateSportsInformation(soldier!, {
        sports: {
          esports: ['lol'],
          koreaBaseball: ['kbo'],
          koreaBasketball: ['kbl'],
          koreaSoccer: ['kleague'],
          worldBaseball: ['mlb'],
          worldSoccer: ['epl', 'primera'],
          worldBasketball: ['nba'],
        },
      });

      soldier = await getAirForceSoldierWithSports('5f10af798945fa01127412d6');

      let sports = soldier!.sports!;

      expect(sports.koreaBaseball[0]).toBe('kbo');
      expect(sports.esports[0]).toBe('lol');
      expect(sports.koreaBasketball[0]).toBe('kbl');
      expect(sports.koreaSoccer[0]).toBe('kleague');
      expect(sports.worldBaseball[0]).toBe('mlb');
      expect(sports.worldSoccer[0]).toBe('epl');
      expect(sports.worldSoccer[1]).toBe('primera');
      expect(sports.worldBasketball[0]).toBe('nba');

      soldier = await getArmySoldierWithSports('5f10a790cf4c596dc45a659b');

      await updateSportsInformation(soldier!, {
        sports: {
          esports: ['lol'],
          koreaBaseball: ['kbo'],
          koreaBasketball: ['kbl'],
          koreaSoccer: ['kleague'],
          worldBaseball: ['mlb'],
          worldSoccer: ['epl', 'primera'],
          worldBasketball: ['nba'],
        },
      });

      soldier = await getArmySoldierWithSports('5f10a790cf4c596dc45a659b');

      sports = soldier!.sports!;

      expect(sports.koreaBaseball[0]).toBe('kbo');
      expect(sports.esports[0]).toBe('lol');
      expect(sports.koreaBasketball[0]).toBe('kbl');
      expect(sports.koreaSoccer[0]).toBe('kleague');
      expect(sports.worldBaseball[0]).toBe('mlb');
      expect(sports.worldSoccer[0]).toBe('epl');
      expect(sports.worldSoccer[1]).toBe('primera');
      expect(sports.worldBasketball[0]).toBe('nba');

      done();
    });

    it('일치하는 군인이 없으면 null을 반환한다', async (done) => {
      done();
    });
  });
});
