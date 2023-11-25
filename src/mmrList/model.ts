import { Table } from "embed-table";

export interface PlayerData {
    name: string;
    mmr: string;
    lastPlayed: string;
  }

export const mmrListtable = new Table({
    titles: ['Name', 'MMR', 'LastPlayed'],
    titleIndexes: [0, 20, 30],
    columnIndexes: [0, 14 , 22],
    start: '`',
    end: '`',
    padEnd: 2,
  });