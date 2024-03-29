import { Table } from "embed-table";
import { discordToPlayerMap } from "../../env/env";

export interface PlayerData {
    name: string;
    mmr: string;
    lastPlayed: string;
    url: string;
    eventPlayed: string;
    sabori: boolean;    
  }


export const mmrListtable = new Table({
    titles: ['Name', 'MMR', 'Last', 'Event'],
    titleIndexes: [0, 20, 30, 39],
    columnIndexes: [0, 14, 22, 29],
    start: '`',
    end: '`',
    padEnd: 2,
  });


export const getLoungeIdsByDiscordIds = (discordIds: string[]) => 
  discordIds.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');

export const mlCommandParams = [
  {
    name: 'member1',
    description: '一人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  },
  {
    name: 'member2',
    description: '二人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  },
  {
    name: 'member3',
    description: '三人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  },
  {
    name: 'member4',
    description: '四人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  },
  {
    name: 'member5',
    description: '五人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  },  
  {
    name: 'member6',
    description: '六人目のメンバーをメンションしてください',
    type: 6,
    required: false,
  }
];

export const addCommandParams = [
  { 
    name: 'lounge_id',
    description: 'LoungeのIDを入力してください',
    type: 3,
    required: true,
  },
  {
    name: 'discord_id',
    description: 'DiscordのIDを入力してください',
    type: 6,
    required: false,
  }

];