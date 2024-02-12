import {  Client, ButtonBuilder, ActionRowBuilder, EmbedBuilder,  
} from 'discord.js'
import { buildCanButton, buildDropButton, think } from './model';
import { getMogiFormat } from './getMogiFormat';

export async function handleRecruitmentInteraction(client: Client) {
    const embed = new EmbedBuilder().setTitle('#2084 2v2: 02月12日 23時');
    embed.setDescription('minchaso \r\n aaa \r\n bbb \r\n ');
    const channel = client.channels.cache.get(process.env.CHANNEL_TEST || '');
    if (!!channel && channel.isTextBased()) {
        const sentMessage = await channel.send({ embeds: [embed] });
        console.log('sentMessage',sentMessage)
        const targetMessage = await channel.messages.fetch(sentMessage.id);
        console.log('targetMessage',targetMessage.embeds[0].description)
        if(!targetMessage.embeds[0].title) return;
        console.log('targetMessage',getMogiFormat(targetMessage.embeds[0].title))
        channel.send({
            components: [new ActionRowBuilder<ButtonBuilder>({
                components: [
                    buildCanButton(sentMessage.id), think, buildDropButton(sentMessage.id),
                ]
            })]
        });
    } 
}