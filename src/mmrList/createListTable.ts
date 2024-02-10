import { EmbedBuilder } from "discord.js";
import { getAverageMmr, getMmrList } from "./getMmrList";
import { PlayerData, mmrListtable } from "./model";
import { Table } from "embed-table";

export const createEmbedMmrList = async (loungeIds:string[]) :Promise<EmbedBuilder>=> {

    const mmrList = await getMmrList(loungeIds);
    const tables = await addMmrListToTable(mmrList);
    // console.log(tables[0]);
    // console.log(tables[1]);
    const embed = new EmbedBuilder().setFields(tables.toField());
    embed.setColor('Random')
    embed.setFooter({ text: getTimeStamp()})

    return embed;
}


const addMmrListToTable = async (mmrList:PlayerData[]) :Promise<Table>=> {
    const table = mmrListtable
    const sortedMmrList = sortMmrList(mmrList);
    console.log(sortedMmrList);
    for (const playerData of sortedMmrList) {
          table.addRow([playerData.name, playerData.mmr, playerData.lastPlayed,playerData.eventPlayed]);
    }
    const averageMmr = getAverageMmr(sortedMmrList);
    table.addRow(['--------------', '--------', '-------', '--']);
    table.addRow(['averageMMR', averageMmr.toFixed(2),'     '],{override: 2});
    return table;
}


const sortMmrList = (mmrList:PlayerData[]) :PlayerData[]=> {
    return mmrList.sort((a, b) => {
        if (Number(a.mmr) > Number(b.mmr)) {
            return -1;
        } else {
            return 1;
        }
    });
}

const getTimeStamp = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}/${day} ${hours}:${minutes}`;
}



export const createEmbedUrlList = async (loungeIds:string[]) :Promise<EmbedBuilder>=> {

    const mmrList = await getMmrList(loungeIds);
    const tables = await addMmrListToTable(mmrList);
    // console.log(tables[0]);
    // console.log(tables[1]);
    const embed = new EmbedBuilder().setFields(tables.toField());
    embed.setColor('Random')
    embed.setFooter({ text: getTimeStamp()})

    return embed;
}