import { Table } from "embed-table";
import { getPlayerDataFromWeb } from "./getPlayerDataFromWeb";

export const getMmrs = async (ids: string[]): Promise<Table> => {
    //   const mmrs = new Map<string, string>();
    
      const table = new Table({
        titles: ['名前', 'MMR'],
        titleIndexes: [0, 22],
        columnIndexes: [0, 14],
        start: '`',
        end: '`',
        padEnd: 2
      });
    
      for (const id of ids) {
        const playerData = await getPlayerDataFromWeb(id);
        console.log(playerData);
        // mmrs.set(playerData.name, playerData.mmr);
        table.addRow([playerData.name, playerData.mmr]);
        // console.log(playerData);
      }
    
      return table;
    };