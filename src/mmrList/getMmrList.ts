import { getPlayerDataFromWeb } from "./getPlayerDataFromWeb";
import { PlayerData } from "./model";

export const getMmrList = async (ids: string[]): Promise<PlayerData[]> => {
  const promises = ids.map(id => getPlayerDataFromWeb(id));
  const mmrList = await Promise.all(promises);
  return mmrList;
};

export const getAverageMmr = (mmrList:PlayerData[]) :number=> {
  let total = 0;
  for (const playerData of mmrList) {
      total += Number(playerData.mmr);
  }
  return total / mmrList.length;
}