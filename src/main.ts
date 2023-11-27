//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, ApplicationCommandDataResolvable, } from 'discord.js'
import dotenv from 'dotenv'
import { makeTeamHandler, mmlListHandler } from './mmrList';
import { createEmbedMmrList } from './mmrList/createListTable';
import { discordToPlayerMap, playerIds } from '../env/env';

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
      description: "MMLリストを表示します。1~6人まで指定可能。全体を見たい場合は指定なし",
      options: [
        {
          name: 'member1',
          description: '一人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        },
        {
          name: 'member2',
          description: '二人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        },
        {
          name: 'member3',
          description: '三人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        },
        {
          name: 'member4',
          description: '四人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        },
        {
          name: 'member5',
          description: '五人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        },  
        {
          name: 'member6',
          description: '六人目のメンバーをメンションしてください',
          type: 6,
          required: false,
        }
      ],
    },
    // {
    //   name: "ml2",
    //   description: "MMLリストを表示します",
    // }
  ];
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
  await interaction.deferReply();
  await interaction.editReply('MMLリストを表示します');

  if (interaction.commandName === 'ml') {
      // await mmlListHandler(interaction);

      if(interaction.options.data.length > 0){
        const targetDiscordIds: string[] = [];
        console.log('optionsあり')
        interaction.options.data.forEach(option => {
          console.log(option.value)
          if (typeof option.value === 'string') {
            targetDiscordIds.push(option.value);
          }
        })
        

        // interaction.options.data.forEach(option => {
        //   const value = option.value;
        //   if (typeof value === 'string') {
        //     targetDiscordIds.push(value);
        //   }
        // });
        const targetPlayerIds = targetDiscordIds.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');
        const embedMmrList = await createEmbedMmrList(targetPlayerIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }else{
        const embedMmrList = await createEmbedMmrList(playerIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }
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

