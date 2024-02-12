import { Client, CommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, Guild, User, ButtonInteraction } from "discord.js";

interface ExecutorForFirebase {
    discordGuild: Guild;
    discordUser: User;
    discordName: string;
    loungeId: string;
}

interface ExecutorFromButtonInteraction {
    guildId: string;
    channnelId: string;
    user: User;
    nickName: string;
    messageContent: string;
}

export const getExecutorForFirebase = (
    client: Client,
    interaction: CommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
): ExecutorForFirebase => {
    const guildId = interaction.guildId || '';
    const discordGuild = client.guilds.cache.get(guildId);
    const discordId = interaction.options.data[1].value?.toString() || interaction.user.id;
    const discordUser = client.users.cache.get(discordId);
    const discordNickName = discordGuild?.members.cache.get(discordId)?.nickname || '';
    const discordName = discordNickName ? discordNickName : discordUser?.username;
    const loungeId = interaction.options.data[0].value?.toString() || '';

    if (!discordGuild || !discordUser || !discordName || !loungeId) {
        throw new Error('Executorの取得に失敗しました');
    }

    return { discordGuild, discordUser, discordName, loungeId };
};

export const getExecutorFromButtonInteraction = (
    client: Client,
    interaction: ButtonInteraction
): ExecutorFromButtonInteraction => {
    const guildId = interaction.guildId || '';
    const channnelId = interaction.channelId || '';
    const user = interaction.user;
    const discordGuild = client.guilds.cache.get(guildId);
    const nickName = discordGuild?.members.cache.get(user.id)?.nickname || '';
    const messageContent = interaction.message.content;

    return { guildId, channnelId, user, nickName, messageContent };
};
