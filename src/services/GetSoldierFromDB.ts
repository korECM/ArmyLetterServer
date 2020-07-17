import ArmySoldierModel from '../models/ArmySoldier';
import AirForceSoldierModel from '../models/AirForceSoldier';

export async function getArmySoldier(soldierID: string) {
  let soldier = await ArmySoldierModel.findOne({ _id: soldierID }).exec();
  return soldier;
}

export async function getAirForceSoldier(soldierID: string) {
  let soldier = await AirForceSoldierModel.findOne({ _id: soldierID }).exec();
  return soldier;
}
