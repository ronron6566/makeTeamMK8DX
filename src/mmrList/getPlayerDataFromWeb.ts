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