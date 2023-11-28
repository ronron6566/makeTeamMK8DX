import { Message } from "discord.js";
import { createEmbedMmrList } from "./createListTable";
import { playerIds } from "../../env/env";
import { getPlayerIdsByDiscordIds } from "./model";

export const mmrListHandler = async (message: Message) => {
    const embedMmrList = await createEmbedMmrList(playerIds);  
    message.channel.send({ embeds: [embedMmrList] });
}

export const makeTeamHandler = async (message: Message) => {
    const targetDiscordIds = (message.content.match(/<@(.*?)>/g) || []).map(match => match.slice(2, -1));
    const targetPlayerIds = getPlayerIdsByDiscordIds(targetDiscordIds)
    if (targetPlayerIds.length > 0) {
        const embedMmrList = await createEmbedMmrList(targetPlayerIds);  
        message.channel.send({ embeds: [embedMmrList] });
    } else {
        message.channel.send('プレイヤーを指定してください');
    }   

}