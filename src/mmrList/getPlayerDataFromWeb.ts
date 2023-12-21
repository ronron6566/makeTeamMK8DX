import axios from 'axios';
import cheerio from 'cheerio';
import { PlayerData } from './model';

export const getPlayerDataFromWeb = async (id: string): Promise<PlayerData> => {
  const url = getUrl(id);

  try {
    const response = await axios.get(url);
    
  if (response.status === 200) {
    const html = response.data;
    const $ = cheerio.load(html);
    const dtElements = $('dt');
    let name = '----';
    let mmr = '----';
    let lastPlayed = '--/--';  
    let eventPlayed = '----';
    let sabori = false;
      
    dtElements.each((index, element) => {
      const text = $(element).text().trim();
      const nameAndRank = $('h1').text().trim();
      name = nameAndRank.split(' - ')[0];
      eventPlayed = $('div.col-lg-3.col-md-4.col-sm-6.col-xs-6 dt:contains("Events Played")').next('dd').text().trim();
      eventPlayed = eventPlayed.padStart(3, " "); 


      if (text === 'MMR') {
        const nextDD = $(element).next('dd');
        mmr = nextDD.text().trim();
        if(mmr === 'Placement'){
          mmr = '----';
        }
        return false; // ループ終了
      }
      const dataTime = $('span.utc-to-local').attr('data-time');
      // data-time属性の値から日付部分を抽出
      if(dataTime) {
        const dateObject = new Date(dataTime);
        const sysDate = new Date();
        const diffInMilliseconds = sysDate.getTime() - dateObject.getTime();
        // ミリ秒から時間に変換
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // ミリ秒を時間に変換
        console.log(name)
        console.log(`Date型とsysDateの差分は ${diffInHours} 時間です`);
        if(diffInHours > 96){
          sabori = true;
        }
        lastPlayed = dateObject.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
      }
    });

    return { name, mmr, lastPlayed, url, eventPlayed, sabori };
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