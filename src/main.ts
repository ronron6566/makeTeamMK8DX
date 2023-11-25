//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, } from 'discord.js'
import dotenv from 'dotenv'
import { createEmbedMmrList } from './mmrList/createListTable';
import { playerIds } from './env';

// const playerIds: string[] = ['22459','28459','29796','31627','31883','33309','36912','42088','42092','42226'];


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

