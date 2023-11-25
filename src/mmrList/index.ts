import { Message } from "discord.js";
import { createEmbedMmrList } from "./createListTable";
import { playerIds } from "../env";

export const mmlListHandler = async (message: Message) => {
    const embedMmrList = await createEmbedMmrList(playerIds);  
    message.channel.send({ embeds: [embedMmrList] });
}

// export const mmlListHandler = async (interaction:  ) => {
//     const embedMmrList = await createEmbedMmrList(playerIds);  
//     message.channel.send({ embeds: [embedMmrList] });
// }