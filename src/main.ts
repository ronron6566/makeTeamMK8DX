//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message,EmbedBuilder } from 'discord.js'
import { Table } from 'embed-table';
import dotenv from 'dotenv'
// import axios from 'axios';
// import cheerio from 'cheerio';
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

//Botがきちんと起動したか確認
client.once('ready', () => {
    console.log('Ready!')
    if(client.user){
        console.log(client.user.tag)
    }


})

client.on('messageCreate', async (message: Message) => {

    if (message.author.bot) return
    if (message.content === '!mmrlist' || message.content === '!ml') {
        const embedMmrList = await createEmbedMmrList(playerIds);  
        message.channel.send({ embeds: [embedMmrList] });
    }
})


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)

const createEmbedMmrList = async (playerIds:string[]) :Promise<EmbedBuilder>=> {

    const table = await getMmrs(playerIds);

    const embed = new EmbedBuilder().setFields(table.toField());
    embed.setColor('Random')
    embed.setTimestamp()

    return embed;

}

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
  
