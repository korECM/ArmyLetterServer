import ArmySoldierModel from '../models/ArmySoldier';
import AirForceSoldierModel from '../models/AirForceSoldier';
require('../models/Sports');

// type soldierPopulate = 'sports';

export async function getArmySoldier(soldierID: string) {
  return await ArmySoldierModel.findOne({ _id: soldierID }).exec();
}

export async function getAirForceSoldier(soldierID: string) {
  return await AirForceSoldierModel.findOne({ _id: soldierID }).exec();
}

export async function getArmySoldierWithSports(soldierID: string) {
  let soldier = await ArmySoldierModel.findOne({ _id: soldierID }).populate('sports').exec();
  return soldier;
}

export async function getAirForceSoldierWithSports(soldierID: string) {
  let soldier = await AirForceSoldierModel.findOne({ _id: soldierID }).populate('sports').exec();
  return soldier;
}
