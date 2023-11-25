import { EmbedBuilder } from "discord.js";
import { getMmrs } from "./getPlayerData";

export const createEmbedMmrList = async (playerIds:string[]) :Promise<EmbedBuilder>=> {

    const table = await getMmrs(playerIds);

    const embed = new EmbedBuilder().setFields(table.toField());
    embed.setColor('Random')
    embed.setTimestamp()

    return embed;
}
