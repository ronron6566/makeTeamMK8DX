import { ButtonInteraction, Client, EmbedBuilder } from "discord.js";
import { getExecutorFromButtonInteraction } from "../interaction/getExecutor";
import { getMogiFormat } from "./getMogiFormat";
import { discordToPlayerMap } from "../../env/env";
import { createEmbedMmrList } from "../mmrList/createListTable";


export const handleCanOrDropInteraction = async (interaction: ButtonInteraction, client: Client, messageId:string, canParticipate: boolean) => {

    const {user} = getExecutorFromButtonInteraction(client,interaction);
    
    const authorId = user.id;
    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_BOSHU || '');
    if (!!channel && channel.isTextBased()) {

        const targetMessage = await channel.messages.fetch(messageId);
        console.log('targetMessage',targetMessage)
        const targetMessageEmbed = targetMessage.embeds[0];
        const description = targetMessageEmbed.description;
        const newEmbed = new EmbedBuilder().setTitle(targetMessageEmbed.title);
        if (description) {
            if(description.includes(`<@${authorId}>`) && canParticipate){
                interaction.reply({ content: 'すでに参加しています', ephemeral: true });
                return;
            }else if(!description.includes(`<@${authorId}>`) && !canParticipate){
                interaction.reply({ content: 'まだ参加していません', ephemeral: true });
                return;
            }
            console.log('description',description)
            const updatedDescription = buildDescription(description,authorId,canParticipate);
            if(!updatedDescription){
                await targetMessage.edit('募集が終了しました');
                return;
            }
            console.log('updatedDescription',updatedDescription);
            newEmbed.setDescription(updatedDescription);
            const recruitNumber = targetMessageEmbed.title ? getMogiFormat(targetMessageEmbed.title) : null;
            const memberCount = updatedDescription.split('\n').length;
            newEmbed.setFooter({ text: `@${recruitNumber ? recruitNumber-memberCount : ''}` });
            await targetMessage.edit({ embeds: [newEmbed] });
            const actionType = canParticipate ? '参加' : '辞退';
            await channel.send(`** @${recruitNumber ? recruitNumber-memberCount : ''}** <@${user.id}>さんが${actionType}しました。`);
            if(memberCount === recruitNumber){
                const members = updatedDescription.split('\r\n').map((member) => {
                    return member.replace('<@','').replace('>','').replace(' ',''); 
                });
                console.log('members',members);
                const targetLoungeIds = members.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');
                console.log('targetLoungeIds',targetLoungeIds)
                const embedMmrList = await createEmbedMmrList(targetLoungeIds);
                await interaction.channel?.send({ embeds: [embedMmrList] });

            }
        }
        console.log('owari')

    } 

};

const buildDescription = (description: string, userId:string, canParticipate: boolean) => {
    if(canParticipate){
        return `${description}\r\n <@${userId}>`;
    }else{
        return description.replace(`<@${userId}>`,'');
    }

}



