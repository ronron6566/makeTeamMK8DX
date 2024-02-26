import { Client, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonInteraction,  
} from 'discord.js'
import { buildCanButton, buildDropButton } from './model';
// import { getMogiFormat } from './getMogiFormat';
import { getExecutorFromButtonInteraction } from '../interaction/getExecutor';
import { getMogiFormat } from './getMogiFormat';

export const handleRecruitmentInteraction = async (interaction: ButtonInteraction, client: Client) => {
    console.log(interaction)    
    const {user,messageContent} = getExecutorFromButtonInteraction(client,interaction);
    const embed = new EmbedBuilder().setTitle(messageContent);
    const recruitNumber = getMogiFormat(messageContent);
    embed.setDescription(`<@${user.id}>\r\n`);
    embed.setFooter({ text: `@${recruitNumber-1}` }); 

    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_BOSHU || '');
    if (!!channel && channel.isTextBased()) {
    
        const roleId = '1108738421968617512'; // メンションしたいロールのID
        const roleMention = `<@&${roleId}>`; // ロールのメンション形式を作成
        await channel.send(`↓↓↓ ${roleMention} ** @${recruitNumber-1}** <@${user.id}>さんがSQ募集を開始しました。↓↓↓`);
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