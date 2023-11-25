import { getPlayerDataFromWeb } from "./getPlayerDataFromWeb";
import { PlayerData,  } from "./model";

export const getMmrList = async (ids: string[]): Promise<PlayerData[]> => {
  const mmrList: PlayerData[] = [];
  for (const id of ids) {
    const playerData = await getPlayerDataFromWeb(id);
    console.log(playerData);
    mmrList.push(playerData);
  }
  return mmrList;
};