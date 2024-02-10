//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, ApplicationCommandDataResolvable, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js'
import dotenv from 'dotenv'
import { makeTeamHandler, mmrListHandler } from './mmrList';
import { createEmbedMmrList } from './mmrList/createListTable';
import { discordToPlayerMap, loungeIds } from '../env/env';
import { addCommandParams, mlCommandParams } from './mmrList/model';
import { addInitialPlayerData, addPlayerData, deleteAllData } from './dao/accessFirestore';
import { pleaseWait } from './util/botReplies';
import { getExecutor } from './interaction/getExecutor';
import cron from 'node-cron';
import dayjs from 'dayjs';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import { add } from 'cheerio/lib/api/traversing';

dayjs.extend(timezone);
dayjs.extend(utc);

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
    }
  // }else if(interaction.commandName === 'bt'){
  //   console.log('interaction:bt')
  //   const confirm = new ButtonBuilder({
  //     custom_id: 'send',
  //     style: ButtonStyle.Primary,
  //     label: 'ロール申請',
  //     emoji: '🎮',


  // });
  // const register = new ActionRowBuilder()
  //           .addComponents(confirm);
  //   await interaction.editReply({embeds: [embed], components:[register],ephemeral: true});   );
  // }

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
  }else if (message.content === '!ul') {
    // const  links = [];
    // // Mapをループしてユーザー名とURLを取得
    // for (const [userId, playerNumber] of discordToPlayerMap) {
    //     try {
    //         // Discordのユーザーを取得
    //         // サーバーからメンバー情報を取得
    //         const member = await message.guild.members.fetch(userId);
    //         // メンバーのニックネームを取得
    //         const nickname = member.displayName;
    //         // リンクを作成して配列に追加
    //         const user = await client.users.fetch(userId);
    //         // リンクを作成して配列に追加
    //         links.push(`[${user.username}](https://www.mk8dx-lounge.com/PlayerDetails/${playerNumber})`);
    //     } catch (error) {
    //         console.error(`Failed to fetch user ${userId}:`, error);
    //     }
    // }
    // // リンクをメッセージとして送信
    // message.channel.send(links.join('\n'));
  }


})

const getTodayLines = async (channelId: string) => {
  try {
    const channel = client.channels.cache.get(channelId);
    if (!!channel && channel.isTextBased() ) {
      const messages = await channel.messages.fetch({ limit: 1 });
      const latestMessage = messages.first();
      if (!latestMessage) {
        console.error('No messages found');
        return;
      }

      console.log(`Latest message content: ${latestMessage.content}`);

      const text = latestMessage.content; // メッセージのテキストを取得

      const lines = text.split('\n'); // テキストを行ごとに分割


      const today = new Date();
      const todayDateString = today.toDateString();
      console.log(todayDateString);

      const todayLines = lines.filter((line) => {
        const timestamps = line.match(/<t:(\d+):[FR]>/g);
        if (!timestamps) return false;

        return timestamps.some((timestampStr) => {
          const matchedTimestamp = timestampStr.match(/<t:(\d+):[FR]>/);
          if (!matchedTimestamp) return false;

          const timestamp = parseInt(matchedTimestamp[1]);
          return new Date(timestamp * 1000).toDateString() === todayDateString;
        });
      });

      console.log(todayLines);
      return todayLines;
      
    } else {
      console.error('Channel is not a text channel');
    }
    } catch (error) {
      console.error('Error fetching messages:', error);
      sendError();
    }
  }

  const convertTodayLinesToJst = async (todayLines: string[]) => {

    const result: string[] = [];

    todayLines.forEach((str) => {
      const replacedStr = str.replace(/<t:(\d+):[FR]> - <t:\d+:[FR]>/, (match, timestamp) => {
        const japanTime = dayjs.unix(timestamp).utcOffset(540).format('MM月DD日 HH時');
        return japanTime;
    });
      result.push(replacedStr);
    });
  
    // console.log(result);
    return result;
  }

  const sendError = () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ERROR || '');
    if (!!channel && channel.isTextBased()) {
      channel.send('エラーが発生しました');
    }
  }
      


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
