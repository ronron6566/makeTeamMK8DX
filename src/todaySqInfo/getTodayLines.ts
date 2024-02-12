import dayjs from 'dayjs';
import { client, sendError } from '../main';

export const getTodayLines = async (channelId: string) => {
  try {
    const channel = client.channels.cache.get(channelId);
    if (!!channel && channel.isTextBased()) {
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
        if (!timestamps)
          return false;

        return timestamps.some((timestampStr) => {
          const matchedTimestamp = timestampStr.match(/<t:(\d+):[FR]>/);
          if (!matchedTimestamp)
            return false;

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
};
export const convertTodayLinesToJst = async (todayLines: string[]) => {

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
};
