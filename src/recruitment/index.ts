import { Client, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonInteraction,  
} from 'discord.js'
import { buildCanButton, buildDropButton } from './model';
// import { getMogiFormat } from './getMogiFormat';
import { getExecutorFromButtonInteraction } from '../interaction/getExecutor';
import { getMogiFormat } from './getMogiFormat';

export const handleRecruitmentInteraction = async (interaction: ButtonInteraction, client: Client) => {
    console.log(interaction)    
    const {user,nickName,messageContent} = getExecutorFromButtonInteraction(client,interaction);
    const embed = new EmbedBuilder().setTitle(messageContent);
    const recruitNumber = getMogiFormat(messageContent);
    embed.setDescription(`<@${user.id}>\r\n`);
    const channel = client.channels.cache.get(process.env.CHANNEL_TEST || '');
    if (!!channel && channel.isTextBased()) {
        await channel.send(`↓↓↓ ** @${recruitNumber}** ${nickName}さんがSQ募集を開始しました。↓↓↓`);
        const sentMessage = await channel.send({ embeds: [embed] });
        // console.log('sentMessage',sentMessage)
        const targetMessage = await channel.messages.fetch(sentMessage.id);
        // console.log('targetMessage',targetMessage.embeds[0].description)
        if(!targetMessage.embeds[0].title) return;
        // console.log('targetMessage',getMogiFormat(targetMessage.embeds[0].title))
        channel.send({
            components: [new ActionRowBuilder<ButtonBuilder>({
                components: [
                    buildCanButton(sentMessage.id), buildDropButton(sentMessage.id),
                ]
            })]
        });
    } 
}