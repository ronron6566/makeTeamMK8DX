import { Table } from "embed-table";

export type PlayerData = {
    name: string;
    mmr: string;
  }

export const mmrListtable = new Table({
    titles: ['Name', 'MMR'],
    titleIndexes: [0, 22],
    columnIndexes: [0, 14],
    start: '`',
    end: '`',
    padEnd: 2
  });