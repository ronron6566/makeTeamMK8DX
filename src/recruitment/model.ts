import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";


export const can = new ButtonBuilder()
	.setCustomId('can')
	.setLabel('参加')
	.setStyle(ButtonStyle.Primary)
  .setEmoji('✋');
export const think = new ButtonBuilder()
	.setCustomId('think')
	.setLabel('微妙')
	.setStyle(ButtonStyle.Secondary)
  .setEmoji('🤔');

export const drop = new ButtonBuilder()
	.setCustomId('drop')
	.setLabel('辞退')
	.setStyle(ButtonStyle.Secondary)
  .setEmoji('❌');


// export const actionRowForSq = ():ActionRowBuilder<ButtonBuilder> => 
//   new ActionRowBuilder<ButtonBuilder>({
//     components: [
//       can, think, drop
//     ]
//   });