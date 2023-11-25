//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, } from 'discord.js'
import dotenv from 'dotenv'
import { makeTeamHandler, mmlListHandler } from './mmrList';
import { createEmbedMmrList } from './mmrList/createListTable';
import { playerIds } from './env';

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
    
    const mlCommand = [{
      name: "ml",
      description: "MMLリストを表示します",
    },
    {
      name: "ml2",
      description: "MMLリストを表示します",
    }];
    client.application.commands.set(mlCommand);

    // const mlCommand2 = [{
    //   name: "ml2",
    //   description: "MMLリストを表示します",
    // }];
    // client.application.commands.set(mlCommand2);
  }


})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
      return;
  }
  if (interaction.commandName === 'ml') {
      // await mmlListHandler(interaction);
      await interaction.deferReply();
      await interaction.editReply('MMLリストを表示します');
      const embedMmrList = await createEmbedMmrList(playerIds);
      await interaction.channel?.send({ embeds: [embedMmrList] });
  }
});

client.on('messageCreate', async (message: Message) => {

  console.log(message.content)

  if (message.author.bot) return
  if (message.content === '!mmrlist' || message.content === '!ml') {
    await mmlListHandler(message);
  }else if (message.content.startsWith('!ml') || message.content.startsWith('!mt')) {
    await makeTeamHandler(message);
  }
  // if (message.content.startsWith('!maketeam') || message.content.startsWith('!mt')) {
  //   await makeTeamHandler(message);
  // }
})


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)

