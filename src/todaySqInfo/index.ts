import { ActionRowBuilder, ButtonBuilder, Client } from "discord.js";
import { convertTodayLinesToJst, getTodayLines } from "./getTodayLines";
import { recruitment } from "../recruitment/model";


export const sendTodaySQInfo = async (client:Client) => {
    console.log('今日のSQ投稿');
    const todayLines = await getTodayLines(process.env.CHANNEL_SQ_INFO || '');
    if (!todayLines) return;
    // const combinedMessage = (await convertTodayLinesToJst(todayLines)).join('\n');
    const todaySqInfo = await convertTodayLinesToJst(todayLines);
    console.log('todaySqInfo',todaySqInfo);

    const textSqNotice = '今日のSQ情報です！\nぜひみなさん！積極的に！参加しましょう！\n';

    // textSqNotice += combinedMessage;

    const channel = client.channels.cache.get(process.env.CHANNEL_TODAY_SQ_INFO || '');
    if (!!channel && channel.isTextBased()) {
        channel.send(textSqNotice);
        for (const message of todaySqInfo) {
            // channel.send(message);
            await channel.send({
                content: message,
                components: [new ActionRowBuilder<ButtonBuilder>({
                    components: [
                      recruitment
                    ]
                })]
             });
        }
    }
};

export const 


sendSQInfo = async (client:Client) => {
    console.log('今週のSQ投稿');
    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_INFO || '');
    if (!!channel && channel.isTextBased()) {
    if (!channel) {
        console.error('Channel not found');
        return;
    }

    const messages = await channel.messages.fetch({ limit: 1 });
    const latestMessage = messages.first();
    if (!latestMessage) {
        console.error('No messages found');
        return;
    }

    console.log(`Latest message content: ${latestMessage.content}`);

    const text = latestMessage.content; // メッセージのテキストを取得

    const lines = text.split('\n'); // テキストを行ごとに分割

    if (!!channel && channel.isTextBased()) {
        for (const message of lines) {
            // channel.send(message);
            await channel.send({
                content: message,
                components: [new ActionRowBuilder<ButtonBuilder>({
                    components: [
                      recruitment
                    ]
                })]
             });
        }
    }
}
}; 