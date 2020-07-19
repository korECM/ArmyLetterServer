import util from 'util';
import cheerio from 'cheerio';
import request from 'request-promise';
import { parseString } from 'xml2js';

interface NewsInterface {
  title: string;
  description: string;
  image: string;
  content: string;
}

type NewsCategory = 'all' | 'entertain' | 'sports' | 'society' | 'politics' | 'economic' | 'foreign' | 'culture' | 'digital';

type NewsDataCategory = 'title' | 'image' | 'description' | 'content';

interface NewsResultInterface {
  getData: () => NewsInterface[];
  getTitles: () => string[];
  getImageURLs: () => string[];
  getDesc: () => string[];
  getContent: () => string[];
  gets: (category: NewsDataCategory[]) => any[];
  getTime: () => string;
}

const parseXML = async (xml: string): Promise<[string, NewsInterface[]]> => {
  const ps = util.promisify(parseString);
  const data: any = await ps(xml);

  let time = data.rss.channel[0]['dc:date'][0];

  let items = data.rss.channel[0].item;
  let willBeRequested: Promise<NewsInterface>[] = [];
  for (let item of items) {
    let temp: NewsInterface = {
      title: '',
      description: '',
      image: '',
      content: '',
    };
    temp.title = item.title[0];
    temp.description = item.description[0];
    if (item.enclosure) {
      temp.image = item.enclosure[0].$.url;
    }
    willBeRequested.push(getRawData(item.link[0], temp));
  }
  let results = await Promise.all(willBeRequested);
  return [time, results];
};

const getRawData = async (url: string, data: NewsInterface): Promise<NewsInterface> => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        uri: url,
        followAllRedirects: true,
      },
      (e, res, body) => {
        const $ = cheerio.load(body);
        const section = $('#harmonyContainer > section');
        data.content = section
          .text()
          .replace(/ +/g, ' ')
          .replace(/[\r\n]+/g, '\n')
          .replace(/(\n )+/g, '\n')
          .trim()
          .replace(/\[.*?뉴시?스.*?\]/g, '')
          .replace(/\[.*?신문.*?\]/g, '')
          .replace(/\(.*?=.*?\)/g, '')
          .replace(/\[[^[]*?(KBS|MBC|SBS)[^[]*?\]/g, '')
          .replace(/[a-zA-Z\d]*@[a-zA-Z]*.[a-zA-Z.]*/g, '')
          .replace(/.{2,4} 특파원 ?=? ?/g, '')
          .replace(/.{2,4} 기자 ?=? ?/g, '')
          .replace(/.{2,4} 인턴기자 ?=? ?/g, '')
          .trim();
        resolve(data);
      },
    );
  });
};
/**
 * 뉴스를 받아오는 함수입니다.
 * category는 원하는 뉴스 분야를 의미합니다.
 *
 * NewsCategory.all 종합
 *
 * NewsCategory.entertain 연예
 *
 * NewsCategory.sports 스포츠
 *
 * NewsCategory.society 사회
 *
 * NewsCategory.politics 정치
 *
 * NewsCategory.economic 경제
 *
 * NewsCategory.foreign 국제
 *
 * NewsCategory.culture 문화생활
 *
 * NewsCategory.digital IT과학
 *
 * @param {NewsCategory} category News.Category에 담긴 분야를 전달합니다
 * @returns {Promise<NewsResultInterface>} 뉴스 정보를 가져올 수 있는 함수들이 담긴 객체
 * @example
 * News(NewsCategory.all)
 * .then(data => {
 *    data.getData();
 *    data.gets([newsDataCategory.imageURL, newsDataCategory.title]);
 * });
 */
async function News(category: NewsCategory): Promise<NewsResultInterface> {
  let url = `http://media.daum.net/rss/today/primary/${category}/rss2.xml`;
  try {
    const data: string = await request(url);
    const [time, result] = await parseXML(data);
    return {
      getData: () => {
        return result;
      },
      getTitles: () => {
        return result.map((data) => data.title);
      },
      getImageURLs: () => {
        return result.map((data) => data.image);
      },
      getDesc: () => {
        return result.map((data) => data.description);
      },
      getContent: () => {
        return result.map((data) => data.content);
      },
      /**
       *
       *
       * @param {NewsDataCategory[]} 받아오고 싶은 정보들
       * @returns {NewsInterface[]>}
       * */
      gets: (category: NewsDataCategory[]) => {
        let sCategory: NewsDataCategory[] = category.reduce<NewsDataCategory[]>((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
        let dataArray: any[] = result.map((data) => {
          let dataObject: any = {};
          sCategory.forEach((category) => {
            dataObject[`${category}`] = data[category];
          });
          return dataObject;
        });
        return dataArray;
      },
      getTime: () => time,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export { News, NewsCategory, NewsDataCategory };
