import { Client } from "discord.js";
import { convertTodayLinesToJst, getTodayLines } from "./getTodayLines";


export const sendTodaySQInfo = async (client:Client) => {
    console.log('今日のSQ投稿');
    const todayLines = await getTodayLines(process.env.CHANNEL_SQ_INFO || '');
    if (!todayLines) return;
    const combinedMessage = (await convertTodayLinesToJst(todayLines)).join('\n');

    let textSqNotice = '今日のSQ情報です！\nぜひみなさん！積極的に！参加しましょう！\n';

    textSqNotice += combinedMessage;

    const channel = client.channels.cache.get(process.env.CHANNEL_SQ_BOSHU || '');
    if (!!channel && channel.isTextBased()) {
        channel.send(textSqNotice);
    }
};
