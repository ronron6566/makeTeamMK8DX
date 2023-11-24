//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message,EmbedBuilder } from 'discord.js'
import { Table } from 'embed-table';
import dotenv from 'dotenv'
// import axios from 'axios';
// import cheerio from 'cheerio';
import { outputLog } from './log';
import { getPlayerDataFromWeb } from './getPlayerDataFromWeb';

const playerIds: string[] = ['22459','28459','29796','31627','31883','33309','36912','42088','42092','42226'];


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

// const prefix = '!'; // コマンドのプレフィックス

// メモリ内にTODOリストを保持するためのMap
// const todoList = new Map();

//Botがきちんと起動したか確認
client.once('ready', () => {
    console.log('Ready!')
    if(client.user){
        console.log(client.user.tag)
    }


})


//!timeと入力すると現在時刻を返信するように
client.on('messageCreate', async (message: Message) => {

    console.log(outputLog('test'));
    if (message.author.bot) return
    if (message.content === '!time') {
        const date1 = new Date();
        message.channel.send(date1.toLocaleString());
    }else if (message.content === '!mmrlist' || message.content === '!ml') {

        const table = await getMmrs(playerIds);

          const embed = new EmbedBuilder().setFields(table.toField());
          embed.setColor('Random')
          embed.setTimestamp()
          message.channel.send({ embeds: [embed] });

    }
})


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)


const getMmrs = async (ids: string[]): Promise<Table> => {
//   const mmrs = new Map<string, string>();

  const table = new Table({
    titles: ['名前', 'MMR'],
    titleIndexes: [0, 22],
    columnIndexes: [0, 14],
    start: '`',
    end: '`',
    padEnd: 2
  });



//   console.log(outputTable);

  for (const id of ids) {
    const playerData = await getPlayerDataFromWeb(id);
    console.log(playerData);
    // mmrs.set(playerData.name, playerData.mmr);
    table.addRow([playerData.name, playerData.mmr]);
    // console.log(playerData);
  }

  return table;
};

export type PlayerData = {
    name: string;
    mmr: string;
  }
  
//   export const getMmr = async (id: string): Promise<PlayerData> => {
//     const url = getUrl(id);
  
//     try {
//       const response = await axios.get(url);
      
//       if (response.status === 200) {
//         const html = response.data;
//         const $ = cheerio.load(html);
//         const dtElements = $('dt');
//         let name = 'NAMEが見つかりませんでした';
//         let mmr = 'MMRが見つかりませんでした';
        
//         dtElements.each((index, element) => {
//           const text = $(element).text().trim();
//           const nameAndRank = $('h1').text().trim();
//           name = nameAndRank.split(' - ')[0];
//           if (text === 'MMR') {
//             const nextDD = $(element).next('dd');
//             mmr = nextDD.text().trim();
//             return false; // ループ終了
//           }
//         });
  
//         return { name, mmr };
//       } else {
//         console.log('ウェブページにアクセスできませんでした');
//         throw new Error('ウェブページにアクセスできませんでした');
//       }
//     } catch (error) {
//       console.log('エラーが発生しました:', error);
//       throw error;
//     }
//   };
//   const getUrl = (id: string) => {
//     return `https://www.mk8dx-lounge.com/PlayerDetails/${id}`;
//   }