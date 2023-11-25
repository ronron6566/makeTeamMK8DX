import { EmbedBuilder } from "discord.js";
import { getPlayerData } from "./getPlayerData";

export const createEmbedMmrList = async (playerIds:string[]) :Promise<EmbedBuilder>=> {

    const table = await getPlayerData(playerIds);

    const embed = new EmbedBuilder().setFields(table.toField());
    embed.setColor('Random')
    embed.setTimestamp()

    return embed;
}
