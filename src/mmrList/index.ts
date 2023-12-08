import { Message } from "discord.js";
import { createEmbedMmrList } from "./createListTable";
import { loungeIds } from "../../env/env";
import { getLoungeIdsByDiscordIds } from "./model";

export const mmrListHandler = async (message: Message) => {
    const embedMmrList = await createEmbedMmrList(loungeIds);  
    message.channel.send({ embeds: [embedMmrList] });
}

export const makeTeamHandler = async (message: Message) => {
    const targetDiscordIds = (message.content.match(/<@(.*?)>/g) || []).map(match => match.slice(2, -1));
    const targetLoungeIds = getLoungeIdsByDiscordIds(targetDiscordIds)
    if (targetLoungeIds.length > 0) {
        const embedMmrList = await createEmbedMmrList(targetLoungeIds);  
        message.channel.send({ embeds: [embedMmrList] });
    } else {
        message.channel.send('プレイヤーを指定してください');
    }   

}