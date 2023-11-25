import { Table } from "embed-table";
import { getPlayerDataFromWeb } from "./getPlayerDataFromWeb";
import { mmrListtable } from "./model";

export const getPlayerData = async (ids: string[]): Promise<Table> => {
    //   const mmrs = new Map<string, string>();
    
      const table = mmrListtable
      for (const id of ids) {
        const playerData = await getPlayerDataFromWeb(id);
        console.log(playerData);
        // mmrs.set(playerData.name, playerData.mmr);
        table.addRow([playerData.name, playerData.mmr]);
        // console.log(playerData);
      }
    
      return table;
    };