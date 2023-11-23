//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message, } from 'discord.js'
import dotenv from 'dotenv'


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
const todoList = new Map();

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
    }else if (message.content === '!showlist') {
        // TODOリストを表示するコマンド
        const todoItems = Array.from(todoList.values());
        // const list = todoItems.length ? todoItems.join('\n') : 'TODOリストは空です';
        // message.channel.send(`TODOリスト:\n${list}`);


        const todoListEmbed = {
          color: 0x0099ff,
          title: 'TODOリスト',
          description: todoItems.length ? todoItems.join('\n') : '空です',
        };

        message.channel.send({ embeds: [todoListEmbed] });

    }else if (message.content.startsWith('!addtodo')) {
        // TODOリストにアイテムを追加するコマンド
        const item = message.content.split(' ').slice(1).join(' ');
        if (!item) {
            message.channel.send('追加するアイテムを入力してください');
        } else {
            todoList.set(item, item);
            message.channel.send(`'${item}' をTODOリストに追加しました`);
        }
    }
})


//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)
