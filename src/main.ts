//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, ApplicationCommandDataResolvable } from 'discord.js'
import dotenv from 'dotenv'
import { makeTeamHandler, mmrListHandler } from './mmrList';
import { createEmbedMmrList } from './mmrList/createListTable';
import { discordToPlayerMap, playerIds } from '../env/env';
import { mlCommandParams } from './mmrList/model';

//.envファイルを読み込む
dotenv.config()

//Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
})

//Botがきちんと起動したか確認
client.once('ready', () => {

  console.log('Ready!')
  if(client.user){
    console.log(client.user.tag)
  }

  if(client.application){
    
    const mlCommand: ApplicationCommandDataResolvable[] = [{
      name: "ml",
      description: "MMRリストを表示します。1~6人まで指定可能。全体を見たい場合は指定なし",
      options: mlCommandParams
    },
    // {
    //   name: "ml2",
    //   description: "MMRリストを表示します",
    // }
  ];
    client.application.commands.set(mlCommand);
  }


})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
      return;
  }
  await interaction.deferReply();
  await interaction.editReply('MMRリストを表示します');

  if (interaction.commandName === 'ml') {
    console.log('interaction:ml')

      // 引数がある場合は引数のユーザーのMMRリストを表示
      if(interaction.options.data.length > 0){
        const targetDiscordIds: string[] = [];
        interaction.options.data.forEach(option => {
          if (typeof option.value === 'string') {
            targetDiscordIds.push(option.value);
          }
        })
        
        const targetPlayerIds = targetDiscordIds.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');
        const embedMmrList = await createEmbedMmrList(targetPlayerIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }else{
        // 引数がない場合は全体のMMRリストを表示
        const embedMmrList = await createEmbedMmrList(playerIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }
  }
});

client.on('messageCreate', async (message: Message) => {

  console.log('message',message.content)

  if (message.author.bot) return
  // !ml のみの場合は全体のMMRリストを表示
  if (message.content === '!mmrlist' || message.content === '!ml') {
    await mmrListHandler(message);
  // !ml @user1 @user2... の場合は指定したユーザーのMMRリストを表示
  }else if (message.content.startsWith('!ml') || message.content.startsWith('!mt')) {
    await makeTeamHandler(message);
  }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
