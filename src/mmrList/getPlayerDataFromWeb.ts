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
      
    dtElements.each((index, element) => {
      const text = $(element).text().trim();
      console.log(text);
      const nameAndRank = $('h1').text().trim();
      name = nameAndRank.split(' - ')[0];

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
        lastPlayed = dateObject.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' });
      }
    });

    return { name, mmr, lastPlayed };
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