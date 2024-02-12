import { ButtonBuilder, ButtonStyle } from "discord.js";

export const recruitment = new ButtonBuilder()
	.setCustomId('recruitment')
	.setLabel('募集')
	.setStyle(ButtonStyle.Primary);

export const think = new ButtonBuilder()
	.setCustomId('think')
	.setLabel('微妙')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('🤔');

export const buildCanButton = (eventMessageId: string): ButtonBuilder => {
	const can = new ButtonBuilder()
		.setCustomId(`can-${eventMessageId}`)
		.setLabel('参加')
		.setStyle(ButtonStyle.Primary)
		.setEmoji('✋');
	return can;
};

export const buildDropButton = (eventMessageId: string): ButtonBuilder => {
	const drop = new ButtonBuilder()
		.setCustomId(`drop-${eventMessageId}`)
		.setLabel('辞退')
		.setStyle(ButtonStyle.Secondary)
		.setEmoji('❌');
	return drop;
};
