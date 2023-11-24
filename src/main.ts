//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message,EmbedBuilder } from 'discord.js'
import { Table } from 'embed-table';
import dotenv from 'dotenv'
import axios from 'axios';
import cheerio from 'cheerio';

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

        //   const outputTable = table.toString();

        //   console.log(outputTable);
        //   message.channel.send(outputTable);




        // const embed = new EmbedBuilder()
        // .setTitle('埋め込みのタイトル')
        // .setFields({ name: 'name', value: 'value'}, { name: 'aa', value: 'bb'})
        // // .addFields({ name: 'name', value: 'value'})
        // // .addFields({ name: 'aa', value: 'bb'})
        // .setColor('Random')
        // .setTimestamp()//引数にはDateオブジェクトを入れることができる。何も入れないと今の時間になる

        // embed.addField('名前', 'MMR', true);


        // TODOリストを表示するコマンド
        // const todoItems = Array.from(todoList.values());
        // const list = todoItems.length ? todoItems.join('\n') : 'TODOリストは空です';
        // message.channel.send(`TODOリスト:\n${list}`);


        // const todoListEmbed = {
        //   color: 0x0099ff,
        //   title: 'TODOリスト',
        //   description: playerIds.length ? playerIds.join('\n') : '空です',
        // };



    // }else if (message.content.startsWith('!addtodo')) {
    //     // TODOリストにアイテムを追加するコマンド
    //     const item = message.content.split(' ').slice(1).join(' ');
    //     if (!item) {
    //         message.channel.send('追加するアイテムを入力してください');
    //     } else {
    //         todoList.set(item, item);
    //         message.channel.send(`'${item}' をTODOリストに追加しました`);
    //     }
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
    const playerData = await getMmr(id);
    // mmrs.set(playerData.name, playerData.mmr);
    table.addRow([playerData.name, playerData.mmr]);
    // console.log(playerData);
  }

//   const embed = new EmbedBuilder().setFields(table.toField());
//   const outputTable = table.toString();
//   message.channel.send({ embeds: [embed] });


  return table;
};

type NameAndMmr = {
    name: string;
    mmr: string;
  }
  
  export const getMmr = async (id: string): Promise<NameAndMmr> => {
    const url = getUrl(id);
  
    try {
      const response = await axios.get(url);
      
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        const dtElements = $('dt');
        let name = 'NAMEが見つかりませんでした';
        let mmr = 'MMRが見つかりませんでした';
        
        dtElements.each((index, element) => {
          const text = $(element).text().trim();
          const nameAndRank = $('h1').text().trim();
          name = nameAndRank.split(' - ')[0];
          if (text === 'MMR') {
            const nextDD = $(element).next('dd');
            mmr = nextDD.text().trim();
            return false; // ループ終了
          }
        });
  
        // console.log(`抽出された文字列:${name}`);
        // console.log(`取得したMMR: ${mmr}`);
  
        return { name, mmr };
      } else {
        console.log('ウェブページにアクセスできませんでした');
        throw new Error('ウェブページにアクセスできませんでした');
      }
    } catch (error) {
      console.log('エラーが発生しました:', error);
      throw error;
    }
  };
  const getUrl = (id: string) => {
    return `https://www.mk8dx-lounge.com/PlayerDetails/${id}`;
  }