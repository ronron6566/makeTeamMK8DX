//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, ApplicationCommandDataResolvable, ButtonBuilder, ActionRowBuilder,
} from 'discord.js'
import dotenv from 'dotenv'
import { makeTeamHandler, mmrListHandler } from './mmrList';
import { createEmbedMmrList } from './mmrList/createListTable';
import { discordToPlayerMap, loungeIds } from '../env/env';
import { addCommandParams,  mlCommandParams,  } from './mmrList/model';
import { addInitialPlayerData, addPlayerData, deleteAllData } from './dao/accessFirestore';
import { pleaseWait } from './util/botReplies';
import { getExecutor } from './interaction/getExecutor';
import cron from 'node-cron';
import dayjs from 'dayjs';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {  recruitment,} from './recruitment/model';
import { getTodayLines, convertTodayLinesToJst } from './mogiEvents/getTodayLines';
import { handleRecruitmentInteraction } from './recruitment';
// import { add } from 'cheerio/lib/api/traversing';

dayjs.extend(timezone);
dayjs.extend(utc);

//.envファイルを読み込む
dotenv.config()

//Botで使うGatewayIntents、partials
export const client = new Client({
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

  try {

  cron.schedule('0 0 0 * * *', async () => {
    // ここで特定の処理を実行
    console.log('今日のSQ投稿')
    const todayLines = await getTodayLines(process.env.CHANNEL_SQ_INFO || '');
    if(!todayLines) return;
    const combinedMessage = (await convertTodayLinesToJst(todayLines)).join('\n');

    let textSqNotice = '今日のSQ情報です！\nぜひみなさん！積極的に！参加しましょう！\n';

    textSqNotice += combinedMessage; 

    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_BOSHU || '');
    if (!!channel && channel.isTextBased()) {
      channel.send(textSqNotice);
    } 
  });

  cron.schedule('0 * * * *', async () => {
    // ここで特定の処理を実行
    console.log('MMRLIST毎時更新')
    const channel = client.channels.cache.get(process.env.CHANNEL_MMRLIST || '');
    if (!!channel && channel.isTextBased()) {
      const message = await channel.messages.fetch(process.env.MESSAGE_MMRLIST || '');
      const embedMmrList = await createEmbedMmrList(loungeIds);
      message.edit({ embeds: [embedMmrList] });
    } 
  });

  console.log('Ready!')
  if(client.user){
    console.log(client.user.tag)
    // addInitialPlayerData();
  }



  if(client.application){
    
    const mlCommand: ApplicationCommandDataResolvable[] = [{
      name: "ml",
      description: "MMRリストを表示します。1~6人まで指定可能。全体を見たい場合は指定なし",
      options: mlCommandParams
    },
    {
      name: "ul",
      description: "URLリストを表示します",
    },
    {
      name: "add",
      description: "MMRリストにプレイヤーを追加します",
      options: addCommandParams
    },
    {
      name: "bt",
      description: "ボタン表示テスト用",
    },
  ];
    client.application.commands.set(mlCommand);
  }

}catch(error){
  console.log(error);
  sendError();
}

})

client.on("interactionCreate", async (interaction) => {
  try{

  if (!interaction.isCommand()) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('can-')) {
        console.log('can')
        console.log(interaction)
        await interaction.update({ content: '参加しました', components: [] });
      } else if (interaction.customId === 'think') {
        await interaction.update({ content: '微妙ですね', components: [] });
      } else if (interaction.customId.startsWith('drop-')) {
        await interaction.update({ content: '辞退しました', components: [] });
      } else if (interaction.customId === 'recruitment') {
        await handleRecruitmentInteraction(client);
        // // await interaction.update({ content: '募集中です', components: [can,] });
        // const embed = new EmbedBuilder().setTitle('#2084 2v2: 02月12日 23時');
        // embed.setDescription('minchaso \r\n aaa \r\n bbb \r\n ');
        // const channel = client.channels.cache.get(process.env.CHANNEL_TEST || '');
        // if (!!channel && channel.isTextBased()) {
        //   // channel.send({ embeds: [embed] });
        //   const sentMessage = await channel.send({ embeds: [embed] });
        //   console.log('sentMessage',sentMessage)
        //   const targetMessage = await channel.messages.fetch(sentMessage.id);
        //   console.log('targetMessage',targetMessage.embeds[0].description)
        //   if(!targetMessage.embeds[0].title) return;
        //   console.log('targetMessage',getMogiFormat(targetMessage.embeds[0].title))
        //   channel.send({
        //     // content: `#2084 2v2: 02月12日 23時`,
        //     components: [new ActionRowBuilder<ButtonBuilder>({
        //         components: [
        //           buildCanButton(sentMessage.id), think, buildDropButton(sentMessage.id),
        //         ]
        //     })]
        //   });
        // } 
      }
    }

      return;
  }
  await interaction.deferReply();
  console.log('interaction',interaction.guildId)
  

  if (interaction.commandName === 'ml') {
    console.log('interaction:ml')
    await interaction.editReply(pleaseWait);

      // 引数がある場合は引数のユーザーのMMRリストを表示
      if(interaction.options.data.length > 0){
        const targetDiscordIds: string[] = [];
        interaction.options.data.forEach(option => {
          if (typeof option.value === 'string') {
            targetDiscordIds.push(option.value);
          }
        })
        
        const targetLoungeIds = targetDiscordIds.map(key => discordToPlayerMap.get(key)).filter((id): id is string => typeof id === 'string');
        const embedMmrList = await createEmbedMmrList(targetLoungeIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }else{
        // 引数がない場合は全体のMMRリストを表示
        const embedMmrList = await createEmbedMmrList(loungeIds);
        await interaction.channel?.send({ embeds: [embedMmrList] });
      }

    await interaction.editReply('MMRリストを表示しました');
  }else if (interaction.commandName === 'add') {
    console.log('interaction:add')
    await interaction.editReply(pleaseWait);
    const executor = getExecutor(client, interaction);

    const guildId = executor.discordGuild.id;
    const discordId = executor.discordUser.id;
    const discordName = executor.discordName;
    const loungeId = executor.loungeId;

    addPlayerData(guildId, discordId, loungeId);
    await interaction.editReply(discordName + 'をMMRリストに追加しました');
  }else if (interaction.commandName === 'ul') {
    console.log('interaction:ul')
    const guildId = interaction.guildId || '';
    const discordGuild = client.guilds.cache.get(guildId);
    if(!discordGuild) throw new Error('Executorの取得に失敗しました');
    // const discordName = executor.discordName;
    // const loungeId = executor.loungeId;

    const  links = [];
    // Mapをループしてユーザー名とURLを取得
    for (const [userId, playerNumber] of discordToPlayerMap) {
        try {
            // Discordのユーザーを取得
            // サーバーからメンバー情報を取得
            const member = await discordGuild.members.fetch(userId);
            // メンバーのニックネームを取得
            const nickname = member.displayName;
            // リンクを作成して配列に追加
            // const user = await client.users.fetch(userId);
            // リンクを作成して配列に追加
            links.push(`[${nickname}](https://www.mk8dx-lounge.com/PlayerDetails/${playerNumber})`);
        } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
        }
    }
    // リンクをメッセージとして送信
    await interaction.editReply(links.join('\n'));

  
  // }else if (interaction.commandName === 'sq') {

  //   const channelId = '1149368837981085849'; // ここにチャンネルIDを入力

  //   try {
  //     const channel = client.channels.cache.get(channelId);
  //     if (!!channel && channel.isTextBased() ) {
  //       const messages = await channel.messages.fetch({ limit: 1 });
  //       const latestMessage = messages.first();
  //       if (!latestMessage) {
  //         console.error('No messages found');
  //         return;
  //       }

  //       console.log(`Latest message content: ${latestMessage.content}`);
  //     } else {
  //       console.error('Channel is not a text channel');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
    // }
  }else if(interaction.commandName === 'bt'){
    console.log('interaction:bt')

    await interaction.editReply({
      content: `ボタンを押してください`,
      components: [new ActionRowBuilder<ButtonBuilder>({
          components: [
            recruitment
          ]
      })]
   });

  }

}catch(error){
    console.log(error);
    sendError();
  }

});

client.on('messageCreate', async (message: Message) => {

  console.log('message',message.guildId)

  if (message.author.bot) return
  // !ml のみの場合は全体のMMRリストを表示
  if (message.content === '!mmrlist' || message.content === '!ml') {
    await mmrListHandler(message);
  // !ml @user1 @user2... の場合は指定したユーザーのMMRリストを表示
  }else if (message.content.startsWith('!ml') || message.content.startsWith('!mt')) {
    await makeTeamHandler(message);
  }else if (message.content === '!initdb') {
    await addInitialPlayerData(message.guildId || '');
  }else if (message.content === '!dldata') {
    await deleteAllData();
  // }else if (message.content === '!ul') {
  }


})

  export const sendError = () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ERROR || '');
    if (!!channel && channel.isTextBased()) {
      channel.send('エラーが発生しました');
    }
  }
  


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
