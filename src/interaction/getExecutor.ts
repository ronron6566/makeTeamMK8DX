import { Client, CommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, Guild, User } from "discord.js";

interface Executor {
    discordGuild: Guild
    discordUser: User
    discordName: string
    loungeId: string
}

export const getExecutor = (
    client:Client,
    interaction: CommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction):Executor => {
        const guildId = interaction.guildId || '';
        const discordGuild = client.guilds.cache.get(guildId);
        const discordId = interaction.options.data[1].value?.toString() || interaction.user.id;
        const discordUser = client.users.cache.get(discordId);
        const discordNickName = discordGuild?.members.cache.get(discordId)?.nickname || '';
        const discordName = discordNickName ? discordNickName : discordUser?.username;
        const loungeId = interaction.options.data[0].value?.toString() || '';
        if(!discordGuild || !discordUser || !discordName || !loungeId) throw new Error('Executorの取得に失敗しました'
        );
        return {discordGuild, discordUser, discordName, loungeId}
}
