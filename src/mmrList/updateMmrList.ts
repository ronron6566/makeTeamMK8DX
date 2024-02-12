import { Client } from "discord.js";
import { createEmbedMmrList } from "./createListTable";
import { loungeIds } from "../../env/env";

export const updateMmrList = async (client:Client) => {
    console.log('MMRLIST毎時更新');
    const channel = client.channels.cache.get(process.env.CHANNEL_MMRLIST || '');
    if (!!channel && channel.isTextBased()) {
        const message = await channel.messages.fetch(process.env.MESSAGE_MMRLIST || '');
        const embedMmrList = await createEmbedMmrList(loungeIds);
        message.edit({ embeds: [embedMmrList] });
    }
};