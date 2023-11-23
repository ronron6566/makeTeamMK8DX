import axios from 'axios';
import cheerio from 'cheerio';

type NameAndMmr = {
  name: string;
  mmr: string;
}

export const getMmr = async (id: string):Promise<NameAndMmr> => {

  const url = getUrl(id);

// const url = 'https://www.mk8dx-lounge.com/PlayerDetails/36912';

axios.get(url)
  .then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const dtElements = $('dt');
      let name = 'NAMEが見つかりませんでした';
      let mmr = 'MMRが見つかりませんでした';
      
      // 'MMR'というテキストを持つdt要素を探し、次のdd要素からMMRの値を取得する
      dtElements.each((index, element) => {
        const text = $(element).text().trim();
        name = $('h1').text().trim();
        if (text === 'MMR') {
          const nextDD = $(element).next('dd');
          mmr = nextDD.text().trim();
          return false; // ループ終了
        }
      });

      console.log(`抽出された文字列:${name}`);
      console.log(`取得したMMR: ${mmr}`);

      return {name, mmr}
    } else {
      console.log('ウェブページにアクセスできませんでした');
      throw new Error('ウェブページにアクセスできませんでした');
    }
  })
  .catch((error) => {
    console.log('エラーが発生しました:', error);
    throw error;
  });

}

const getUrl = (id: string) => {
  return `https://www.mk8dx-lounge.com/PlayerDetails/${id}`;
}