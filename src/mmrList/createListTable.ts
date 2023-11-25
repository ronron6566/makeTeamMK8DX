import { EmbedBuilder } from "discord.js";
import { getMmrList } from "./getMmrList";
import { PlayerData, mmrListtable } from "./model";
import { Table } from "embed-table";

export const createEmbedMmrList = async (playerIds:string[]) :Promise<EmbedBuilder>=> {

    const mmrList = await getMmrList(playerIds);
    const table = await addMmrListToTable(mmrList);
    const embed = new EmbedBuilder().setFields(table.toField());
    embed.setColor('Random')
    embed.setTimestamp()

    return embed;
}

const addMmrListToTable = async (mmrList:PlayerData[]) :Promise<Table>=> {
    const table = mmrListtable
    for (const playerData of mmrList) {
        table.addRow([playerData.name, playerData.mmr]);
    }
    return table;
}
