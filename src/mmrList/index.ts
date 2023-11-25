import { Message } from "discord.js";
import { createEmbedMmrList } from "./createListTable";
import { discordToPlayerMap, playerIds } from "../env";

export const mmlListHandler = async (message: Message) => {
    const embedMmrList = await createEmbedMmrList(playerIds);  
    message.channel.send({ embeds: [embedMmrList] });
}

export const makeTeamHandler = async (message: Message) => {
    const targetDiscordIds = (message.content.match(/<@(.*?)>/g) || []).map(match => match.slice(2, -1));
    const targetPlayerIds = targetDiscordIds.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');
    console.log(targetPlayerIds);

    if (targetPlayerIds.length > 0) {
        const embedMmrList = await createEmbedMmrList(targetPlayerIds);  
        message.channel.send({ embeds: [embedMmrList] });
    } else {
        message.channel.send('プレイヤーを指定してください');
    }   

}