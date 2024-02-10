import { getPlayerDataFromWeb } from "./getPlayerDataFromWeb";
import { PlayerData } from "./model";

// export const getMmrList = async (ids: string[]): Promise<PlayerData[]> => {
//   const mmrList: PlayerData[] = [];
//   for (const id of ids) {
//     const playerData = await getPlayerDataFromWeb(id);
//     mmrList.push(playerData);
//   }
//   return mmrList;
// };

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