import { ButtonInteraction, Client,} from "discord.js";
import { getExecutorFromButtonInteraction } from "../interaction/getExecutor";


export const handlePlzInteraction = async (interaction: ButtonInteraction, client: Client, messageId:string,) => {

    const {user} = getExecutorFromButtonInteraction(client,interaction);
    
    const authorId = user.id;
    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_BOSHU || '');
    if (!!channel && channel.isTextBased()) {

        const targetMessage = await channel.messages.fetch(messageId);
        console.log('targetMessage',targetMessage)
        const targetMessageEmbed = targetMessage.embeds[0];
        const description = targetMessageEmbed.description;
        if (description) {
            const updatedDescription = description.replace(`<@${authorId}>`,'');
            await channel.send(`${updatedDescription} 挙手ぷりーず`);
        }
        console.log('owari')

    } 

};


